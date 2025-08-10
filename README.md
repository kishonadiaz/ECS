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
