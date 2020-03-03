Steps:
1. npm install
2. npm run dev (this will run both the node js app and react app in parallel at two different ports 3001 and 3000)
3. This will then automatically open the first page in browser
4. When finish all questions, will be given an uuid. Copy this uuid.
5. Then node js will try to save the answers and uuid into a json file.
6. To get the json file, go to http://localhost:3001/<uuid>.json
7. Currently there is color messup when select the answers, probably a React thing. Will look into it.
8. Still figuring out an appropriate deployment strategy for both node js and react app.
9. Questions can be customized in /src/data/data.js
10. To implement questions path different for different answers, in the node js implement the path /api/:qno/:answer (in /server/index.js) 
which will give different nextq number according to the answer. Can implement more complex logic inside it.
The react app just call fetch to this api endpoint when user click next question
