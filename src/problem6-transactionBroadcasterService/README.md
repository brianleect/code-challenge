# General Flow 

1. When a `POST /broadcast_transaction` is received, we first conduct a check on transaction data validity and if valid, add it to `raw_queue` which stores all transactions received with each transaction attempted to be broadcasted being assigned its own `transactionId`. Return '200 OK' back to client if valid else '4XX-5XX' corresponding error.

2. Function `raw_queue_handler` triggered every ~500ms which pops `raw_queue` till empty, sign the data with gas information based on gas congestion of the network (eth_estimateGas) and push it to `signedTx_queue`.

3. Function `signedTx_queue_handler` triggered every ~500ms which pops `signedTx_queue` till empty, broadcast popped signedTx via rpc request to blockchain node. We will then store {'time':time.time(), 'transactionId':transactionId} to `pending_queue` . Optionally we can include the txHash for the tx which could be used if we wished to determine inclusion in blocks.
    - Event handler `success`  removes relevant transaction from `pending_transactions` and adds it to `successful_tx` 
    - Event handler `failure` removes relevant transaction from `pending_transactions` and adds it to `failed_tx` and also back to `signedTx_queue_handler` which will handle rebroadcasting when the queue handler gets triggered.

4. Function `pending_transactions_handler` triggered every ~2s which checks time that has passed since initial broadcast, if `>30s` has passed, we can treat it as a `failure` with labelled as `timeout` to allow rebroadcasting.

# General specifications
1. Storage (Store historical success/failed tx & for persistent store of various queues utilized in case of system restart) (100mb++ to ? gb depending on popularity of service & period of data stored, most of the space taken up by historical success/failures.)
2. Scalability  (~100-200/s without load balancer. With appropriate request distribution, don't think there's a hard cap but in most cases would not expect to go past 2k/s in most if not all EVM chains, a likely average is ~100 with possible bursts ~1-2k/s) 
3. Client Response time (<1s, Just simple tx validation check is done before attempting to broadcast. Failed broadcasts are handled on server side to be retried.)

# Elaborating on additional constraints

a. A broadcasted transaction might fail and if it fails, it should be retried automatically.
- Handled by event handler `failure` which adds transaction which failed to broadcast back to `signedTx_queue_handler`

c. There should also be a page that shows the list of transactions that passed or failed.
- List of transactions can be obtained by displaying data in `successful_tx`
- List of failed transactions can be obtained by displaying data in `failed_tx`

Fulfilling additional requirements
1. If `POST /broadcast_transction` returns HTTP `200 OK`, it is assumed that the transaction will eventually be broadcasted successfully. If the broadcaster service restarts unexpectedly, it should still fulfil them.
    - To address this, use of persistent data store (Sqlite/PostgreSql) depending on need for scale could be utilized so that in the case of a unexpected restart service can simply load from file and continue from where it was last left at. Note that while it would introduce some additional latency due to additional writes to file being required rather than existing purely in memory, it should not be significant in the overall scheme of things. To prevent bloat over time, we can periodically remove data that has existed past a certain duration (~1 hour?)

2. An admin is able to, at any point in time, retry a failed broadcast.
    - By keeping track of `failed_tx` an admin should be able to rebroadcast has the transaction information is available. 

# Possible improvements

1. Tracking of inclusion rather than just broadcast success
    - A possible flaw with tracking success of broadcasting would be that it is possible for cases for transactions to be broadcasted but not successfully included till a few hours later or even longer due to network congestion. 
    - Considering the objective of broadcasting a transaction is usually for it to be included in a block, a improvement could be to track successful inclusion in a block instead which is usually more impactful to users involved. 
    - Re-broadcasting could be reworked based on time since broadcast without inclusion which would increase gas till inclusion or up till price cap that's preset. (Can be done by tracking incoming blocks and checking if txHash is seen) (Alternative, could loop through pending_queue and see if getTransactionHash returns a valid response which it should if successfully included)

2. Use of API gateway to combat DDOS / Spam
    - Another possible concern might be a single / malicious group of user hogging resources by spamming POST /broadcast_transaction. 
    - Use of an api gateway allows authentication and rate limiting abilities which would greatly increase difficulty to carry out such an attack.

3. Reducing broadcast failures rates
    - While not explicitly stated regarding what causes a failure code to be returned, in the general context of L1s such as ETH/BSC/SOL I believe we can attribute it to network congestion leading to data loss as nodes get overloaded with requests. A possible solution to reduce data loss could be hosting of private nodes with resources catered to service usage only and usage of load balancers to split rpc broadcast requests over multiple such nodes. 

4. Customized plan based on EVM chain characteristics
Also, although EVM chain of interest was not specified, depending on the chain we are broadcasting the transaction on we can adjust expectations regarding success of transaction broadcasting and the fallback plans as well.
    - E.g. SOL known issues with nodes being overloading during hyped mints leading to chain downtimes on occasions and frequent broadcasting failure. Low tx costs + block time  also leads to more spam tx seen usually. Issues broadcasting usually due to network wide congestion, might consider halting attempts to re-broadcast till network is detected to be back up.
    - E.g. ETH generally most stable. Nodes less centralized and spam attacks are significantly more costly to execute. Failing to broadcast might be an issue more likely linked to the specific node/provider rather than a network issue, might consider falling back on alternative node providers (Alchemy/QuikNode etc)