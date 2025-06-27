// D:\DEVELOP\wie\wie_creator\services\auth-service\concurrently.config.js
module.exports = {
  "kill-others-on-fail": true,
  "prefix": "name",
  "prefix-colors": ["cyan", "magenta"],
  "restart-tries": 3,
  "commands": [
    {
      "name": "backend",
      "command": "nodemon src/app.js",
      "prefixColor": "cyan"
    },
    {
      "name": "frontend", 
      "command": "cd client && npm run dev",
      "prefixColor": "magenta"
    }
  ]
};