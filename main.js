const electron=require('electron');
const url=require('url');
const path=require('path');


const {app,BrowserWindow,Menu,ipcMain}=electron;

//set env

process.env.NODE_ENV ='production';

let mainWindow;
let addWindow;

//Listen for app to be ready

app.on('ready',function(){

mainWindow=new BrowserWindow({});


mainWindow.loadURL(url.format({

pathname:path.join(__dirname ,'mainWindow.html'),

protocol:'file:',

slashes:true


})); 


//quit app when closed

mainWindow.on('closed',function(){

app.quit();
});


const mainMenu=Menu.buildFromTemplate(mainMenuTemplate);

Menu.setApplicationMenu(mainMenu);

});

//handle create add window

function createAddWindow(){

addWindow=new BrowserWindow({

width:500,
height:200,

title:'Add Shopping List Item'


});


addWindow.loadURL(url.format({

pathname:path.join(__dirname ,'addWindow.html'),

protocol:'file:',

slashes:true


})); 

// Garbage collection handle


addWindow.on('close' , function(){
 
addWindow = null;

});
}


//catch item add

ipcMain.on('item:add',function(e,item){


mainWindow.webContents.send('item:add',item);
addWindow.close(); 



}); 

//Create a menu template

const mainMenuTemplate= [

{

label:'File',
submenu:[
{ 
   label:'Add Item',
   click(){
        createAddWindow();

 }
      

},


{ label:'Clear Items',
  click(){
  mainWindow.webContents.send('item:clear'); 


}

},

{  label:'Quit',
   accelerator: process.platform == 'darwin'? 'Command+Q' : 'Ctrl+Q' ,
click(){

app.quit();

}


   }
  ]
 }
];

//If mac , add empty object to menu

if(process.platform == 'darwin'){


 mainMenuTemplate.unshift({});


}


// ADD developer tools if not in prod


if(process.env.NODE_ENV !=='production'){


mainMenuTemplate.push({


label:'Developer Tools',

 
submenu:[
{
 label:'Toggle DevTools',
 accelerator: process.platform == 'darwin'? 'Command+I' : 'Ctrl+I' ,
 click(item,focusedWindow){
 
  focusedWindow.toggleDevTools();
}

},
{
  role:'reload'

}

]
});

}

