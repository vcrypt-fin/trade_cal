curl -X GET "https://api.snaptrade.com/v1/activities" ^
-H "Authorization: Basic PARTNER_CLIENT_ID:CONSUMER_KEY" ^
-H "Content-Type: application/json" ^
-H "Signature: " ^
-H "userId: snaptrade-user-123" ^
-H "userSecret: adf2aa34-8219-40f7-a6b3-60156985cc61" ^
-d "{\"startDate\":\"2022-01-24\",\"endDate\":\"2022-01-24\",\"accounts\":\"917c8734-8470-4a3e-a18f-57c3f2ee6631,65e839a3-9103-4cfb-9b72-2071ef80c5f2\",\"brokerageAuthorizations\":\"917c8734-8470-4a3e-a18f-57c3f2ee6631,65e839a3-9103-4cfb-9b72-2071ef80c5f2\",\"type\":\"BUY,SELL,DIVIDEND\"}"