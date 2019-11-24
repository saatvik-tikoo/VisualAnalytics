This project is used as a Visual Analytical Toolkit for analyzing the results of the reaserch paper on "Debiasing Community Detection: The Importance of Lowly-Connected Nodes".

To run this project clone it and follow the given commands:
    1. In the project main folder do "npm install" to install all the dependencies.
    2. Now we need to get the data. 
        a) First copy your data file in createDB folder and name it gamergate.json. 
        b) Now run the Jupyter notebook in createDB folder called CreateDB.ipynb.
    3. Now to run the project do "npm run endtoend".
    4. To check the result goto "http://localhost:8000/view/index.html"

Test Results: According to the tests performed: Usable data file generation takes less than 35 seconds and the generation of each graph takes less than 3.5 seconds.

Note: Currently testing has been done only on Chrome Browser and hence it is strongly suggested to run this application on Chrome.
