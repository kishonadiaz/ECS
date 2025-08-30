# Equipment Checkout System

Runs without a DB and with minimal implementations.

## Run
1) Open `ECS.sln` in Visual Studio.
2) Set **ECS.Api** as Startup → F5. If it crashes CTRL+F5 and load google or microsoft edge and in the search bar type http://localhost or https://localhost and the numbers given in the console left open.
3) Visit `/health` and `/swagger`.

## Next
- Replace the temporary in-memory data with a real database (EF core + SQL Server).
- Improve error messages and add stronger checks so invalid requests are caught early.

## TODO 
- Switch the project to use EF core with SQL server instead of in-memory data.
- Add clear validation rules in controllers and return the correct HTTP status.
- Add secure login with JWT authentication.
- Save all logs and alerts into the database so they don't disappear when the app restarts.
- Update the background job that checks for overdue items:
   - Use the database instead of memory.
   - Run at a set time interval you can configure
   - Avoid duplicate alerts.

## How to use

- Log in with the UserName: alice or bob
- The Passwords for both accounts is Pass123!
   
   These two are test accounts they will allow you access to the project bob is a manager account and as access to the reports page, and as of alice this account is a regular employee account and only has access to the checkout, returns , and inventory pages

## Checkout page

   The checkout page is the page where you checkout the equipment there are two peices of equipment in the table you press the the checkout button for corresponding equipment to check it out

## Return Page

   The return page has a table that will have the equipment that the employee has checkedout and if you want to return the equipment you have to press the return button for the choosen equipment to be returned 

## Inventory Page

   Only consists of a table that shows all equipment and who has checkout it out in an Employee number

## Report Page(Manager)
   
   This page is only visable to mangement and only has graphs that shows some data on the employees 

## Loggin out

   To log out you have to clcik on the link in the side menu to log it, and it will bring you back to the login page where you will have to log in gain to get back in to the project

