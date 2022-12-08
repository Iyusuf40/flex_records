# FLEX_RECORDS
## About
Flex_records is a web application that enables easy record keeping, 
you can quickly and easily store, organize, and manage all your 
important tabular records in one secure and convenient place.
It also allows you to perform computations on your numeric data easily.
This [link](https://cloza.tech) will take you to the landing page of 
flex_records and [this](https://youtu.be/77iz8caEq_A) is a short demo on 
how flex_records can help with simple computations on numeric data.

## Stack
### Front-end
The front-end was built with react. react-router and react-uuid were also incorporated. 
The choice to use react was down to the need to maintain, update and listen for 
state changes. The bulk of the app logic is embedded in the frontend since it is 
wasteful and slow to perform computations in the back-end before re-rendering the 
results in the front-end.

#### Back-end
The back-end of the app was built with python using Flask, Mongodb as database 
and Pymongo as the database driver. 
The choice for using python was because of I beign more proficient in python. 
And Mongodb was used due to the constant changing nature of the data 
structure sent to the backend.

## Installation
The app was built on an ubuntu machine, the instructions below are valid 
for linux based systems.
#### Front-end
Install Node.js from [here](https://nodejs.org/en/download/)

#### Back-end
You need to have python3 installed on your machine, you can check 
this [link](https://docs.python.org/3/using/unix.html#on-linux) to
for instructions on installing python3.
Install [Mongodb](https://www.mongodb.com/docs/manual/administration/install-on-linux/)
Run 
```pip3 install pymongo Flask Flask-CORS
```
to install dependencies.

#### Starting the app

```
git clone https://github.com/Iyusuf40/flex_records
cd flex_records/backend
python3 -m api.v1.app &
cd ../frontend
npm install
npm start &
```
You can now open it on your browser http://localhost:3000

## Contributing
You are welcome to make improvements to the app. 
After makin a pull request, I will check the changes you have made
and merge it to the project if it is a useful addition.
