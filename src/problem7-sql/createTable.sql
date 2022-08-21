-- Create sample table to test query

create table balances (id integer, address varchar(100), denom varchar(100), amount integer, block_height integer); 
		insert into balances (id, address, denom, amount, block_height) values (0,'0x0','usdc',1000000,733755);
        insert into balances (id, address, denom, amount, block_height) values (1,'0x0','swth',-50000,733756);
        insert into balances (id, address, denom, amount, block_height) values (2,'0x1','usdc',200000000,72000);
        insert into balances (id, address, denom, amount, block_height) values (3,'0x2','tmz',500,744000);
        insert into balances (id, address, denom, amount, block_height) values (4,'0x2','usdc',-10000,750000);

-- Note that columns denom and amt are ignored here as not needed for testing 
create table trades (id integer, address varchar(100), block_height integer);
		insert into trades (id,address,block_height) values (0,'0x1',720000);
        insert into trades (id,address,block_height) values (1,'0x2',720000);
        insert into trades (id,address,block_height) values (2,'0x2',780000);
        insert into trades (id,address,block_height) values (3,'0x3',820000);


