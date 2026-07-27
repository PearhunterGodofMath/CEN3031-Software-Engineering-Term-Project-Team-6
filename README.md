# UTILISEE -- A utility cost tracking program

**HTML + CSS + JS** frontend, **Express + SQLite** backend.

## How to Run
```bash
npm install
npm start
```

Then right click on http://localhost:3000/ to open the program.

## How to Use
- Create an account
- Login with credentials
- Click the "Add New Appliance" button
- Insert Appliance information and click "Add Appliance"
- The Utility Table will update with the new data

## The Utility Table
- The Utility Table contains various information about a user's Appliances
  - The user can search for Appliances by name or within a certain date range, and the Utility Table will calculate information based on those filters
- A Summary Delta is provided based on the given time range:
- Example: If the user selects a time range of 5 days, the Summary Delta will provide information comparing that data to the previous 5 days. Likewise for _n_ days.


