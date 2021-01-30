// this code hides the scrollbars if this app is displayed in the iframe of the portfolio page
// the only reason for this is that it simply looks better in the iframe without the scroll bars
// the portfolio page sends a message containing the string "iframe" to the app.
// the app picks the message up (using the code below) and then adds a class so some css can be applied
// if the app is displayed elsewhere the code below won't fire

window.addEventListener("message", (message) => {
  if (message.data === "iframe_crypto_portfolio_viewer") {
    document.querySelector("html").classList.add("hideScrollBar");
    // document
    //   .querySelector("#arrow_container")
    //   .classList.add("display_arrow_container");
  }
  // console.log(document.querySelector("#arrow_container"));
});
