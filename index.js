var express = require('express');
var session = require('express-session');
var app = express();

//设置views

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//中间件

app.use(express.urlencoded({extended:false}));
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:'shhh,very secret'
}));

//验证,实际就是一个拦截，每次有请求发生时执行，当用session用户名不存在，跳转到login，存在就什么也不做。
//注意next()并不会退出函数体，next()后面的代码还会执行。
app.use(function(req,res,next){
    if(!req.session.user){        
        if(req.url == "/login"){        
            next();
        }
        else{
            res.redirect('/login')
        }
    }    
    next();
})

//路由
app.get('/',function(req,res){
    res.redirect('/login');
})

app.get('/login',function(req,res){
    var message = '';
    if(req.session.err){
        message = '用户名密码错误！';
    }    
    res.render('login',{message:message});
})

app.get('/index',function(req,res){
    var user = req.session.user;
    res.render('index',{user:user});
})

//获取表单数据判断
app.post('/login',function(req,res){
    var name = req.body.username;
    var pass = req.body.password;
    if(name==='zs'&&pass==='11'){
        req.session.user = name;
        res.redirect('/index');        
    }else{
        req.session.err = 'err'
        res.redirect('/login');
    }
    
})


app.listen('3000',function(){
    console.log('server run at 3000');
})
