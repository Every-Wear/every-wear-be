import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";
import bcrypts from "bcryptjs";

const SALT_FACTOR = 10; // 해시 알고리즘 적용 회수, 높을수록 보안은 높음 속도는 느려짐
const userSchema = mongoose.Schema({ // 몽구스 요청하고 필드 정의
    name: String,
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
    },
    gender: String, // 성별
    age: String, // 연령대
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });


// DeprecationWarning: 
// collection.ensureIndex is deprecated. Use createIndexes instead. 메세지 안보이게
// mongoose.set("useCreateIndex", true)
userSchema.set("collection", "userInfo"); // collection 이름 정하기

// // 모델에 간단한 메서드 추가
// userSchema.methods.name = function () {
//     return this.nickName || this.userId;
// };

const noop = function () { }; //bcrypt를 위한 빈 함수

// 모델이 저장되기("save") 전(.pre)에 실행되는 함수
userSchema.pre("save", function (done) {
    let user = this;
    if (!user.isModified("password")) {
        return done();
    }

    // 암호화 
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) { return done(err); }
        bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
            if (err) { return done(err); }
            user.password = hashedPassword;
            done();
        });
    });
});

// 비밀번호 검사하는 함수
userSchema.methods.checkPassword = async function (guess) {
    return await bcrypts.compare(guess, this.password);
};

// 실제로 사용자 모델만들고 내보내기
const User = mongoose.model("User", userSchema);
export default User;
