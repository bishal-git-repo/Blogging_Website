// toastService.js
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

// Toastify service function
const toastService = {
  showMessage: (message, type = "success") => {
    const backgroundColor = type === "success" ? "#4CAF50" : type === "error" ? "#F44336" : "#FF9800";
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top", // Position top of the screen
      position: "right", // Position right side of the screen
      backgroundColor: backgroundColor,
      stopOnFocus: true,
    }).showToast();
  }
};

export default toastService;
