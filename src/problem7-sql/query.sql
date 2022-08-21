-- Usage of subquery to allow filtering by created column totalbalance then check if address exist in trades (>730k block_height)
SELECT address FROM (
select address, SUM(CASE WHEN denom = 'usdc' THEN amount*0.000001
WHEN denom = 'swth' THEN amount*0.00000005
WHEN denom='tmz' THEN amount*0.003
END) AS totalbalance
FROM balances 
GROUP BY address
) tmp
WHERE totalbalance >= 500 AND address IN (SELECT address FROM trades WHERE block_height>730000)