
var canvas;
var cxt;
var stopFlag = false;
 
var pointsTotal=[{price:100,timeStamp:getDate01()},{price:101,timeStamp:getDate01()}];
//drawing
var numberOfFirstBarInPointsTotal=0;
var numberOfPointsInABar; 
var numberOfBarsInPointsTotal;

var lastTransaction = "STARTING AT:";
var output02 = "";
var output01 = "";

//ML
var currentPrice = 100;
var offerList =[];
 
var orderBookList=[];
var tradeBookList=[];
var productList =[];

var dollarBalanceInAccount=1001; 
var productBalanceInAccount=12; 
var latestID=0;
var counter01 = 0; 

function init(){
 canvas=document.getElementById("canvasDemo");
 cxt=canvas.getContext("2d");
   
 numberOfPointsInABar = 10;
 setInterval(populateList,100);
 }//INIT

function populateList(){ 
    var n;
    var chance_product=50;
    var chance_offer= 50;
    var chance_buy  =  40;
    var chance_sell =  35;
    if (stopFlag == false){
    if ((Math.random() * 100)<chance_product) {autoPostProduct();}
    if ((Math.random() * 100)<chance_buy){autoBuy();}
    if ((Math.random() * 100)<chance_offer) {autoPostOffer();}
    if ((Math.random() * 100)<chance_sell){autoSell();}
    var currentDOM;
    currentDOM=document.getElementById("currentPrice");
    currentDOM.innerHTML = lastTransaction + currentPrice;

    currentDOM=document.getElementById("prod01");
    currentDOM.innerHTML ="";
 
for (var i=productList.length-10; i< productList.length ; i++){

if (productList[i]!=undefined){  
  var productListP = document.createElement("p");
  productListP.style="height:5px;"
  prod01.appendChild (productListP);
  productListP.innerHTML = "$" + productList[i].price + ", " + " QTY:" + productList[i].qty}//if
}//for

//show OFFER LIST
 currentDOM=document.getElementById("off01");
 currentDOM.innerHTML ="";
 for (var i=0; i<offerList.length; i++){
   if (i<10){  
  var offerListP = document.createElement("p");
  offerListP.style="height:5px;"
  off01.appendChild (offerListP);
  offerListP.innerHTML = "$" + offerList[i].price + " QTY:" + offerList[i].qty}//if
  }//for
 
  var usd = document.getElementById("USD") ;
  usd.innerHTML ="$" +  (dollarBalanceInAccount);
  var usd = document.getElementById("product") ;
  usd.innerHTML = productBalanceInAccount;
  counter01 +=1;
  
  document.getElementById("counter").innerHTML = pointsTotal.length;

   draw1();

 }//if stopFlag
}//populateLIST
   
function compare(a, b) {
   const bandA = parseInt(a.price);
 const bandB = parseInt(b.price);
 let comparison = 0;
 if (bandA < bandB) {
   comparison = 1;
 } else if (bandA > bandB) {
   comparison = -1;
 }
 return comparison;
}

function autoPostProduct(){ 
 latestID=  getLatestID();
 //.05
   var productDollarsToPost =Math.round((1+(.1*Math.random()))*currentPrice);
   var newQty = getRandomInt(4)+1 ;  
   productList.push({price:productDollarsToPost,user:"o",id:latestID,qty:newQty});
   productList.sort(compare);
    
}// autoPostProduct

function postRealProduct(){
 
 var productDollarsToPost = document.getElementById("postProductInput").value;
 var productQuantityToPost = document.getElementById("productQuantityInput").value;

 if (productQuantityToPost<=productBalanceInAccount){
  latestID=  getLatestID();
   productList.push({price:productDollarsToPost,user:"c",id:latestID,qty:productQuantityToPost});
  
   orderBookList.push({price:productDollarsToPost,user:"c",id:latestID,type:"product",qty:productQuantityToPost,oQty:productQuantityToPost});
   productBalanceInAccount-=productQuantityToPost;
   productList.sort(compare);
   updateOrderPane();
}//if
}//postRealProduct()

function autoPostOffer(){ 
 latestID=  getLatestID();
 //.02
var offerAmountToPost =Math.round(( 1-(.02*Math.random())) * currentPrice);
var newQty = getRandomInt(4)+1;   
   offerList.push({price:offerAmountToPost,user:"o",id:latestID,qty:newQty});
   offerList.sort(compare);
  }//function

function postRealOffer(){ 
  var offerAmountToPost = document.getElementById("offerInput").value;
  var offerQuantityToPost = document.getElementById("offerQuantityInput").value;
   if ((offerAmountToPost * offerQuantityToPost) <= dollarBalanceInAccount){
     latestID=  getLatestID();
      offerList.push({price:offerAmountToPost,user:"c",id:latestID,qty:offerQuantityToPost});
      orderBookList.push({price:offerAmountToPost,user:"c",id:latestID,type:"offer",qty:offerQuantityToPost,oQty:offerQuantityToPost});
      dollarBalanceInAccount-=offerAmountToPost*offerQuantityToPost;
      offerList.sort(compare);
     }//if
   
   offerList.sort(compare);
   updateOrderPane();
 }//function

function autoBuy(){
  
  if (productList.length > 0){
   lastTransaction = "BOUGHT AT: ";
   var poppedOrder = productList.pop();
   currentPrice = poppedOrder.price;
   pointsTotal.push({price:currentPrice,timeStamp:getDate01()});
   poppedOrder.qty -=1;
   if (poppedOrder.qty !=0) {
     productList.push(poppedOrder);
   }   
   removeFromOrderBook(poppedOrder.id, poppedOrder.qty);        
 }//if

}//autoBuy

function getLatestID(){ 
var d = new Date();
latestID= d.getTime();
d=new Date("Jun 02 2020");
latestID= latestID-d.getTime();
latestID = latestID *1000;
latestID = latestID + Math.round( 999*Math.random());
return latestID;}

function realBuy(){
 var poppedOrder=null;
 var amountToBuy = document.getElementById("buyInput").value;
 var qtyOfOrderInCreation = 0;
 var notEnoughMoney = 0;
 var whileCounter = 0;

 //start loop
 while (amountToBuy<=dollarBalanceInAccount && amountToBuy>0 && notEnoughMoney== 0 && productList.length>0){
   
    whileCounter +=1;
  //move order out of productList
     
     poppedOrder = productList.pop(); 
              
     if (parseInt(amountToBuy)>=parseInt(currentPrice)  ) {
        
       //BUY THE ITEM 
         lastTransaction = "YOU BOUGHT AT: ";
         currentPrice = poppedOrder.price;
                       
         poppedOrder.qty-=1;
         qtyOfOrderInCreation+=1;
         amountToBuy-=poppedOrder.price;
        
         dollarBalanceInAccount =  dollarBalanceInAccount - poppedOrder.price;
         productBalanceInAccount += 1;
        
         pointsTotal.push({price:currentPrice,timeStamp:getDate01()});
                 
         removeFromOrderBook(poppedOrder.id, poppedOrder.qty);
               
        }//if
     else{ 
          notEnoughMoney = 1;
      
        }
   
        if (poppedOrder.qty==0 || ( notEnoughMoney ==1 && qtyOfOrderInCreation>0)){
          latestID=  getLatestID();
         
          tradeBookList.push({price:currentPrice,oQty:qtyOfOrderInCreation,type:"productBoughtAtMarket",id:latestID});
        
     
         updateOrderPane();
         qtyOfOrderInCreation=0; 
        }//if

   if (poppedOrder.qty>0){
        productList.push(poppedOrder);
      
     }
   }//while
}//realBuy()

function autoSell(){

 if (offerList.length>0){
lastTransaction = "SOLD AT: ";
var  poppedOrder = offerList.shift();
currentPrice = poppedOrder.price;
pointsTotal.push({price:currentPrice,timeStamp:getDate01()});

poppedOrder.qty -=1;
 if (poppedOrder.qty !=0) {
    offerList.unshift(poppedOrder);
 }   

 removeFromOrderBook(poppedOrder.id, poppedOrder.qty);     
    
    updateOrderPane();
  }//if

}//autoSell

function realSell(){
var poppedOrder;
var amountToSell = document.getElementById("sellInput").value;
var qtyOfOrderInCreation=0;
      
 //start loop 
while(amountToSell>0 && (productBalanceInAccount >= amountToSell)){

 //move order out of offerList
    poppedOrder = offerList.shift();
   
  //SELL THE ITEM 
   lastTransaction = "YOU SOLD AT: ";
  
   currentPrice = poppedOrder.price;
   poppedOrder.qty -=1;
   qtyOfOrderInCreation+=1;
   amountToSell-=1;
 
   dollarBalanceInAccount  =  parseInt(dollarBalanceInAccount)+parseInt(currentPrice);
   productBalanceInAccount -=1;
   
   pointsTotal.push({price:currentPrice,timeStamp:getDate01()});
   
   removeFromOrderBook(poppedOrder.id,poppedOrder.qty);
     
 if (poppedOrder.qty==0 || amountToSell==0){
  latestID=  getLatestID();
  tradeBookList.push({price:currentPrice,oQty:qtyOfOrderInCreation,type:"productSoldAtMarket",id:latestID});
 
  qtyOfOrderInCreation=0;
  updateOrderPane();
  }//if

//push back onto orderList
   if (poppedOrder.qty>0){
     offerList.unshift(poppedOrder);
   }//if
 }//while

}//realSell() 

function removeFromOrderBook(keyID,keyQty){
   //find the Item   
   var found =-1;
      for (var i =0;i<orderBookList.length;i++){
       if (orderBookList[i].id == keyID){
       found=i;
       }//if
      }//for
       
      //add difference to user balance 
      if (found>-1){
        var differenceInQuantity =  orderBookList[found].qty-keyQty;
       if (orderBookList[found].type == "product"){
         dollarBalanceInAccount += differenceInQuantity * orderBookList[found].price;
       }
       else// type = "offer"
       {
          productBalanceInAccount  = parseInt(differenceInQuantity)+ parseInt(productBalanceInAccount);
       }

        //if qty==0 then remove it.     
        orderBookList[found].qty = keyQty;
        if (orderBookList[found].qty==0){
       
         if (orderBookList[found].type == "product"){
           orderBookList[found].type ="productSoldOnLimit";
         } 
         else{orderBookList[found].type ="productBoughtOnLimit";

         }
        
         tradeBookList.push(orderBookList[found]);
         orderBookList.splice(found,1);
        }//if
        updateOrderPane();}//if
}

function getRandomInt(max) {
 return Math.floor(Math.random() * Math.floor(max));
}

function updateOrderPane(){ 
   var orderBook = document.getElementById("orderP");
   orderBook.innerHTML = "";
  
   for (var i=0;i<orderBookList.length;i++){
     
     var p1 = document.createElement("div");
     orderBook.appendChild(p1);
     p1.id = "divOrder" + i;
     p1.innerHTML = "ID: " + orderBookList[i].id;
     p1.innerHTML += ", $" + orderBookList[i].price;
     p1.innerHTML += ", " + orderBookList[i].type;
     p1.innerHTML += ", QTY: " + orderBookList[i].qty;

//CANCELBUTTON    
    var cancelButton = document.createElement("button");
    p1.appendChild(cancelButton);
    cancelButton.id=  orderBookList[i].id;
    cancelButton.innerHTML= "X";
    cancelButton.onclick =  function(){cancelOrder(this);
      };
   }//for
  
//tradeBook
var tradeBook = document.getElementById("tradeBook");
     tradeBook.innerHTML = "ORDER HISTORY";
     for (var i=tradeBookList.length-1;i>=0;i--){
     
     var p3 = document.createElement("div");
      tradeBook.appendChild(p3);
      p3.id = "divTrade" + i;
      p3.innerHTML = "ID: " + tradeBookList[i].id;
      p3.innerHTML += ", $" + tradeBookList[i].price;
      p3.innerHTML += ", " + tradeBookList[i].type;
      p3.innerHTML += ", QTY: " + tradeBookList[i].oQty;
      }//for

  }//functionADD
  
function cancelOrder(currentItem){

var found=-1;
 
for (var i=0;i<offerList.length;i++){
  if (currentItem.id==offerList[i].id){
   found = i;
  }//if
}//for

if (found >-1){
   offerList.splice(found,1);
   }//if

  found=-1;
for (var i=0;i<productList.length;i++){
  if (currentItem.id==productList[i].id){
   found = i;
  }//if
}//for
 
 if (found >-1){
   productList.splice(found,1);
 }//if

  found=-1;
  for (var i =0;i<orderBookList.length;i++){
     if (currentItem.id==orderBookList[i].id){
     found=i;
    }//if
 }//for

 if (found >-1)     {
  if (orderBookList[found].type == "offer"){
      dollarBalanceInAccount += orderBookList[found].qty * orderBookList[found].price;
  }//if
   else{
      productBalanceInAccount  =parseInt(productBalanceInAccount )+ parseInt(orderBookList[found].qty);
  }//if
  orderBookList[found].oQty=orderBookList[found].oQty-orderBookList[found].qty;
   if (orderBookList[found].oQty>0){
         tradeBookList.push(orderBookList[found]);
          }//if
  orderBookList.splice(found,1);
 }//if
  
updateOrderPane();
 
}//cancelOrder

//ZOOM FUNCTIONS
function next(){
 numberOfFirstBarInPointsTotal+=2;
}//next

function previous(){
 numberOfFirstBarInPointsTotal-=2;
}//previous

function stop(){stopFlag=true;
}//stop

function start(){stopFlag=false;
}//start

function zoomOut(){numberOfPointsInABar+=15;
}//zoomOut

function zoomIn(){numberOfPointsInABar-=15;
}//zoomIn

function gotoEnd(){
  numberOfFirstBarInPointsTotal=numberOfBarsInPointsTotal-2;
}//gotoEnd

function getDate01()
{
 var retVal;
var d = new Date();
retVal = d.getHours()+ ":" + d.getMinutes() + ":" + d.getSeconds();
return retVal;
}

//DRAW FUNCTIONS
function draw1(){

 var firstPositionInPointsTotal;
 var lastPositionInPointsTotal;
 var pointsOnCanvas=[];
 var numberOfBarsOnCanvas;
 var barNumberOnCanvas=0;
 var positionOfFirstPointOnThisBarInCanvasArray;
 var positionOfLastPointOnThisBarInCanvasArray;
 var currentBar;  //array
 var minValueOnThisBar = 0;
 var maxValueOnThisBar = 0;
 var maxPointOnCanvas = 0;
 var minPointOnCanvas = 0;
 var topOfBar;
 var barHeight;
 var yConvertor01;
 var p1;     
    
 var widthOfABar = 15;
 var leftMargin = 30;
 var rightMargin = 30;

  numberOfBarsInPointsTotal = Math.ceil(pointsTotal.length/numberOfPointsInABar);    
  numberOfBarsOnCanvas = Math.ceil((canvas.width-leftMargin-rightMargin) / widthOfABar);
  
  output01  = ", numberOfBarsInPointsTotal: " + numberOfBarsInPointsTotal;
  output01  += ", numberOfPointsInABar: " + numberOfPointsInABar;
  output01  += ", numberOfBarsOnCanvas: " + numberOfBarsOnCanvas;
 
  if (numberOfPointsInABar<=0) {
  numberOfPointsInABar = 1;
  }//if
 
  // sets numberOfFirstBarInPointsTotal
  // does not allow just 2 or 3 bars on the board. board should be full from right to left.
  if((numberOfBarsInPointsTotal >= numberOfBarsOnCanvas) && ((numberOfBarsInPointsTotal-numberOfFirstBarInPointsTotal )<=numberOfBarsOnCanvas)){
    numberOfFirstBarInPointsTotal=numberOfBarsInPointsTotal-numberOfBarsOnCanvas+1;}//if
   output01  += ", numberOfFirstBarInPointsTotal: " +  numberOfFirstBarInPointsTotal;

   firstPositionInPointsTotal= (numberOfFirstBarInPointsTotal * numberOfPointsInABar);

   output01  += ", firstPositionInPointsTotal: " +   firstPositionInPointsTotal;
   
   lastPositionInPointsTotal = ((numberOfFirstBarInPointsTotal + numberOfBarsOnCanvas) *(numberOfPointsInABar))-1;

   output01  += ", lastPositionInPointsTotal: " +   lastPositionInPointsTotal;

   if ((firstPositionInPointsTotal > pointsTotal.length-1)||(firstPositionInPointsTotal<0)){
     firstPositionInPointsTotal=0;
     numberOfFirstBarInPointsTotal =0;}//if
        
   if (lastPositionInPointsTotal >(pointsTotal.length-1)){
     lastPositionInPointsTotal = pointsTotal.length-1;
   }
           
   //load pointsOntoCanvas
   pointsOnCanvas=[];
   for (var i=firstPositionInPointsTotal;i<=lastPositionInPointsTotal;i++)
   {if(pointsTotal[i]==undefined) {
   // pointsOnCanvas.push(pointsTotal[i-1].price);
   pointsOnCanvas.push(100);
   }
   else {
   pointsOnCanvas.push(pointsTotal[i].price);}
   }//for
   //END load pointsOntoCanvas
      
   //START MAXMIN for pointsOnCanvas
   minPointOnCanvas=pointsOnCanvas[0];
   maxPointOnCanvas=pointsOnCanvas[0];
   for (var i=0;i<pointsOnCanvas.length;i++){
   if (pointsOnCanvas[i] > maxPointOnCanvas){maxPointOnCanvas = pointsOnCanvas[i];
   }
   if (pointsOnCanvas[i] < minPointOnCanvas){minPointOnCanvas = pointsOnCanvas[i];
   }
   }//for  
   maxPointOnCanvas = parseInt(maxPointOnCanvas)+.02 * (maxPointOnCanvas-minPointOnCanvas);
    minPointOnCanvas-= .02 * (maxPointOnCanvas-minPointOnCanvas);
   yConvertor01=canvas.height/(maxPointOnCanvas-minPointOnCanvas);
   if (yConvertor01 == Infinity){yConvertor01=0;}
   //END MAXMIN for pointsOnCanvas

    output01 += ", MAXPOINT: " +  maxPointOnCanvas;
    output01 += ", MINPOINT: " +  minPointOnCanvas;

    //clear Canvas for First Use 
    cxt.fillStyle = "white";
    cxt.fillRect(0 ,0 , canvas.width,canvas.height );   
    var exitWhile = false;

    //setup currentBar
    barNumberOnCanvas = -1;

    //START WHILE!!!this while loop draws ONE instance of canvas
    while (exitWhile==false){
    
       //increment
       currentBar=[];
       barNumberOnCanvas++;
       if (barNumberOnCanvas==numberOfBarsOnCanvas-1) {exitWhile = true;}
   
       positionOfFirstPointOnThisBarInCanvasArray = (barNumberOnCanvas) * (numberOfPointsInABar);
       positionOfLastPointOnThisBarInCanvasArray = (barNumberOnCanvas+1)*(numberOfPointsInABar);
   
       //load currentBar
       for(var i=positionOfFirstPointOnThisBarInCanvasArray;i<= positionOfLastPointOnThisBarInCanvasArray;i++){
       currentBar.push(pointsOnCanvas[i]);
       }//for
       //getMaxMinForBar
       maxValueOnThisBar = currentBar[0];
       minValueOnThisBar = currentBar[0];
       firstElementInThisBarValue = currentBar[0];
       lastElementInThisBarValue = null;    
 
       for (var i=0;i<currentBar.length;i++){
       if (currentBar[i]>maxValueOnThisBar){
       maxValueOnThisBar=currentBar[i];
       }
       if (currentBar[i]<minValueOnThisBar){
       minValueOnThisBar=currentBar[i];
       }
       if (Number.isInteger(currentBar[i])) {
         lastElementInThisBarValue =  currentBar[i];
       }    
       }//for
    
       //GRAPHICS
       //drawTextVERTICAL
       cxt.fillStyle="black";             
   
       var aIncrement = Math.round((maxPointOnCanvas-minPointOnCanvas)/10);
     
       if (aIncrement==0){aIncrement=1;}
 
       for (var i=Math.round(minPointOnCanvas);i< maxPointOnCanvas;i+=aIncrement){ cxt.fillText(i, 0, Math.round(canvas.height -((i-minPointOnCanvas)*yConvertor01)));}

       //drawTextHORIZONTAL
       for (var i=0;i<numberOfBarsOnCanvas;i+=5){
       var labelIndex =null;
    
       labelIndex = (numberOfFirstBarInPointsTotal+i)*numberOfPointsInABar;
      if (labelIndex<lastPositionInPointsTotal){
         cxt.fillText(pointsTotal[labelIndex].timeStamp,(leftMargin+i*widthOfABar),canvas.height-10);

        output01 += ",LV: " + labelIndex;}
         }

        //setup bar 
       barHeight = (firstElementInThisBarValue-lastElementInThisBarValue); 
  
       if (barHeight<0){
       topOfBar = lastElementInThisBarValue;
       cxt.fillStyle="green";
       barHeight=-barHeight;
       }
       else{topOfBar=firstElementInThisBarValue;
       cxt.fillStyle="red";
       } 

       //draw bar
       cxt.fillRect(leftMargin+(barNumberOnCanvas)*widthOfABar , canvas.height-(yConvertor01*(topOfBar-minPointOnCanvas)) , 10, yConvertor01*(barHeight));
 
       //drawVertical
       cxt.beginPath();
       cxt.strokeStyle="black";
      cxt.moveTo(leftMargin+(barNumberOnCanvas)*widthOfABar+5,(canvas.height-yConvertor01*(maxValueOnThisBar-minPointOnCanvas)));
       cxt.lineTo(leftMargin+(barNumberOnCanvas)*widthOfABar+5,canvas.height-yConvertor01*(minValueOnThisBar-minPointOnCanvas));
       cxt.stroke();

       //draw Horizontal
       cxt.beginPath();
       cxt.strokeStyle="black";
       cxt.moveTo(leftMargin+(barNumberOnCanvas)*widthOfABar ,(canvas.height-yConvertor01*(lastElementInThisBarValue-minPointOnCanvas)));
       cxt.lineTo(leftMargin+(barNumberOnCanvas)*widthOfABar +10,canvas.height-yConvertor01*(lastElementInThisBarValue-minPointOnCanvas));
       cxt.stroke(); 
       //END GRAPHICS
       
   }//while


   //pageControls  
   p1 = document.getElementById("p1");   
   p1.innerHTML = " OUT1: "+ output01;
   p1.innerHTML +=" OUT2: " + output02;

}//draw01
