nodemon server 

is the command to start server

i have pushed .env file aslo , because thats where mongodb url is there by that you can run this locally and test 

curl --location 'http://localhost:5050/api/schedule-message' \
--header 'Content-Type: application/json' \
--data '{
    "message": "Meeting at 4 PM",
    "day": "2025-07-31",
    "time": "17:51"
  }'


  this the api is to schedule msg , this will take message and day and time, will insert message at specified date and time 
