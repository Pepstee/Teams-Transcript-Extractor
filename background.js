chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.executeScript(tab.id, {
        code: `
        console.log("Transcript Extractor Script Running...");
        let collectedText = "";
        
        function extractVisibleText() {
            let transcript = document.querySelector('div#scrollToTargetTargetedFocusZone'); // Adjust selector
            if (transcript) {
                let textNodes = transcript.querySelectorAll('div, span, p'); 
                textNodes.forEach(node => {
                    if (node.innerText && !collectedText.includes(node.innerText)) {
                        collectedText += node.innerText + "\\n"; // Append text with line breaks
                    }
                });
            }
        }

        let scrollInterval = setInterval(() => {
            let transcript = document.querySelector('div#scrollToTargetTargetedFocusZone'); // Adjust selector
            if (transcript) {
                extractVisibleText(); // Extract before scrolling
                transcript.scrollBy(0, 2000); // Scroll by 2000px
                if (transcript.scrollTop + transcript.clientHeight >= transcript.scrollHeight) {
                    clearInterval(scrollInterval); // Stop when at the bottom
                    extractVisibleText(); // Final extraction
                    console.log("Scrolling and text extraction complete!");
                    
                    // Create and download the text file
                    let blob = new Blob([collectedText], { type: "text/plain" });
                    let link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = "transcript.txt";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            } else {
                console.error("Transcript area not found!");
                clearInterval(scrollInterval);
            }
        }, 100); // Scroll every 100ms
        `
    });
});
