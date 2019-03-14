
//这种引入js的方法会有延迟
let  JSElement=document.createElement("script");
JSElement.setAttribute("type","text/javascript");
JSElement.setAttribute("src","https://cdn.bootcss.com/crypto-js/3.1.9-1/crypto-js.js");
document.body.appendChild(JSElement);


//所以这里直接使用会导致报错
//localStorage.getItem("myLoanSecretKey")
//localStorage.setItem("myLoanSecretKey", "");
//秘钥直接从关键key里面去取
function decryptedData(aesData, completeBlock) {

    if (!aesData || aesData.length === 0) {
        completeBlock("");
        return;
    }

    let secretKey = localStorage.getItem("mySecretKey");

    if (!secretKey || secretKey.length === 0) {
        completeBlock("");
        return;
    }

    getCryptoJS(() => {
        let key = CryptoJS.enc.Utf8.parse(secretKey);

        let decryptedData = CryptoJS.AES.decrypt(aesData, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.ZeroPadding
        });

        try {
            //防止报错，不是规则的utf8
            let decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedData).toString();
            completeBlock(decryptedStr);
        }catch (e) {
            completeBlock("");
        }
    });
}

function getCryptoJS(completeBlock) {
    //10m刷新一次，防止其他js执行过程中闪现内容
    let timeRepeat = window.setInterval(() => {
        if (CryptoJS) {
            completeBlock();
            window.clearInterval(timeRepeat);
        }
    }, 100);
}
