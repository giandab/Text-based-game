$(document).ready(function(){
    console.log("Hello")
    //function to return response from openai api based on some prompt
    function openai(prompt_text){

        console.log("Switched to new page")//debug
        // Sending HTTP requests to openai
        var url = "https://api.openai.com/v1/completions";
    
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, async= false);
    
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer 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");
    
    
    ///runs every time there is a state change
        xhr.onreadystatechange = function () {
        console.log("State changed!"); //debug
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            var response = $.parseJSON(xhr.responseText)
            alert(response.choices[0].text);
            window.location = "game.html"

        }};
    
        var data = `{
        "model": "text-davinci-003",
        "prompt": "${prompt_text}",
        "temperature": 0.7,
        "max_tokens": 256,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
        }`;
    
        xhr.send(data);
        console.log("Sent data line 42");//debug
    }
    openai("Intoduce a story about a man lost in the wild")
});

