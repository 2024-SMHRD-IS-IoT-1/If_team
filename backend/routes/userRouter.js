const express = require("express");
const router = express.Router();
const conn = require("../config/db");
const nodemailer = require('nodemailer')
const path = require('path')
const session = require('express-session');
const app = express();


//axios로 받아온 데이터확인 
router.post('/getData',(req,res)=> {
    console.log('get data router',req.body);
    res.json({auth : 'user'});
})


// singup 기능 라우터 
router.post("/Signup", (req, res) => {
    console.log(req.body);
    let { user_id,user_pw,user_name,user_email} = req.body;

    // SQL 쿼리 작성
    let sql = "INSERT INTO tb_user (user_id,user_pw,user_name,user_email,joined_at) VALUES (?, ?, ?, ?,NOW())";

    conn.query(sql, [user_id,user_pw,user_name,user_email], (err, result) => {
        if (err) {
            console.error('error:', err);
            return res.status(500).json({ message: "failed", error: err.message });
        }
        console.log('Result:', result);
        try {
        if (result.affectedRows > 0) {
            res.json({ message: "success" });
        } else {
            res.json({ message: "failed" });
        }}catch{
            console.log(err);
        }
    });
});

// 로그인 기능담당 라우터
router.post("/Login",(req,res)=>{
    console.log('user login router', req.body)
    let {user_id,user_pw} = req.body

    let sql = "select user_id, user_pw from tb_user where user_id=? and user_pw=?"
    conn.query(sql,[user_id,user_pw],(err,rows)=>{
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "failed"});
        }
        console.log(rows)

        if(rows.length>0){
            // 로그인 성공 시 세션에 사용자 ID 저장
            req.session.user_id = user_id;
            res.json({message: "success"})
        }else{
            res.status(400).json({message : "failed"})
        }

    });
})
router.get("/Login", (req, res) => {
    if (req.session.user_id) {
      res.json({ user_id: req.session.user_id });
    } else {
      res.status(401).json({ message: "로그인이 필요합니다." });
    }
  });

  //리뷰 라우터 
  router.get('/ReviewList', async (req, res) => {
    let sql ='select * from tb_feedback where feedback_idx IS NOT NULL AND user_id IS NOT NULL'
    conn.query(sql,(err,review_list)=>{
        if(err){
            return res.status(500).json({error:"review_list error"})
        }
        res.json({data:review_list});
        });
    });

/*// 비밀번호 찾기
const transporter = nodemailer.createTransport({
    service: 'gmail', // 사용하려는 이메일 서비스 (예: gmail, yahoo 등)
    auth: {
        user: 'kimsj020406@gmail.com',
        pass: 'bjk92040769@'
    }
});
app.post('/find-userpw', (req, res) => {
    const { user_id , name, email } = req.body;
    const sql = 'SELECT user_pw FROM tb_user WHERE user_id = ? AND user_email = ?';
        conn.sql(sql, [name, email], (err, rows) => {
        try{
            if (results.length > 0) {
                // 임시 비밀번호 생성
                const temporaryPassword = crypto.randomBytes(4).toString('hex');
    
                // 사용자에게 임시 비밀번호를 저장
                const updateSql = 'UPDATE tb_user SET user_pw ? WHERE user_id = ? AND user_email = ?';
                conn.sql(updateSql, [temporaryPassword, name, email], (err) => {
                    if (err) {
                        console.error('비밀번호 업데이트 오류:', err);
                        return res.status(500).send('비밀번호 업데이트 중 오류가 발생했습니다.');
                    }
    
                    // 이메일 발송
                    const mailOptions = {
                        from: 'kimsj020406@gmail.com',
                        to: email,
                        subject: '임시 비밀번호 발송',
                        text: 안녕하세요, ${name}님.\n\n요청하신 임시 비밀번호는 다음과 같습니다: ${temporaryPassword}\n\n로그인 후 비밀번호를 변경해 주세요.
                    };
    
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('이메일 발송 오류:', error);
                            return res.status(500).send('이메일 발송 중 오류가 발생했습니다.');
                        }
    
                        console.log('이메일 발송 성공:', info.response);
                        res.send('임시 비밀번호가 이메일로 발송되었습니다.');
                    });
                });
            } else {
                res.status(404).send('해당 사용자를 찾을 수 없습니다.');
            }}
        catch(err){
            console.log(err);
        }

        });
});

// 아이디 찾기
app.post('/find-username', (req, res) => {
    const { name, email } = req.body;

    const sql = 'SELECT user_id FROM tb_user WHERE user_name = ? AND user_email = ?';
    conn.sql(sql, [name, email], (err, rows) => {
        if (err) {
            console.error('쿼리 오류:', err);
            return res.status(500).send('서버 오류가 발생했습니다.');
        }

        if (results.length > 0) {
            const user_id= rows[0].user_id;

            // 이메일 발송
            const mailOptions = {
                from: 'kimsj020406@gmail.com',
                to: email,
                subject: '아이디 찾기 결과',
                text: 안녕하세요, ${name}님.\n\n요청하신 아이디는 다음과 같습니다: ${user_id}\n\n감사합니다.
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('이메일 발송 오류:', error);
                    return res.status(500).send('이메일 발송 중 오류가 발생했습니다.');
                }

                console.log('이메일 발송 성공:', info.response);
                res.send('아이디가 이메일로 발송되었습니다.');
            });
        } else {
            res.status(404).send('해당 사용자를 찾을 수 없습니다.');
        }
    });
});*/

/*// 정보수정 기능을 담당하는 라우터
router.post("/update",(req,res)=>{
    let {id,pw,name} = req.body
    let sql = "update member set user_name=? where user_id=? and user_pw=?"
    conn.query(sql,[name,id,pw],(err,rows)=>{
        console.log(rows)
        if (rows.affectedRows>0){
            res.redirect('/')
        }else {
            res.send('<script>alert("다시 입력해주세요");window.location.href="/update"</script>')
        }
    })
    console.log("update router",req.body)
    //1. 사용자가 update.html에서 보내온 정보를 각각 id, pw, nick에 담아주자
    //2. sql문 작성 (update 테이블명 set ~ )
    //3. DB안에 연결
    //4. 결과 rows 출력 console
})*/

/*// 회원탈퇴 기능을 담당하는 라우터 
router.post("/delete",(req,res)=>{
    console.log('delete router',req.body)
    let {id,pw}= req.body
    let sql = "delete from member where id=? and pw=?"
    conn.query(sql,[id,pw],(err,rows)=>{
        console.log('rows',rows)
    })
    if(rows.affectedRows>0){
        res.redirect('/')
    }else{
        res.send('<script>alert("탈퇴 실패");window.location.href="/"</script>')
    }
})*/

module.exports = router;