/*
import User from "../user.js";


const generateRrandomEmail = (howMany) => {
    const chr = 'abcdefghijklmnopqrstuvwxyz1234567890';
    const email_list = new Array()
    for (let i = 0; i < howMany; i++){
        let temp = '';
        for(let j = 0; j < 15; j++){
            temp += chr[Math.floor(Math.random() * chr.length)];
        }
        // temp += '@gmail.com';
        email_list.push(temp)
    }
    return email_list;
}

const randomNickName = () => {
    const category = ['페르루사', '바예지드', '제노', 'HIERO', 'STANIMIR', '싱클레어', 'IPHICRATES', '총독', '안티푸스', '미아', 'GELON', '무구정광대다나다너', '클레멘트', '코르부스', '살비', '환우마종', 'ZOPHIA', '시세레스코', '수색', '백봉', '설경구', 'PYRIS', 'OPPIUS', '외노마우스', '레질루스', '텐시', '퀸투스', 'PERSEAS', '네르기스', '스텐킬', '뮤츠', 'EUTUCHES', '쩌호', 'MNESUS', '레우딜로', '청춘', 'PESCENNIUS', '웬디', 'CINNA', '길리', '프로크투스', '피자', '오이클레스', 'CARATACUS', '타다', '바바', 'ABAQHA', '루드위가', '잉꼬', 'BERKHUNGIS', 'CHERNEKOV', 'BOUCHES', '무트트주팰레우스', '드네스티르', '스틸로', 'ISODEMOS', '우유', 'MARSIAS', '호나우당뇨', 'ALEXANDER', 'VALBUSA', '안드리브', 'LAODAMEIA', '구매', '아르카리우스', 'MAINAKE', '유리마코스', '띵호와의증인', 'ABU_SHAKRA', '마르티넨고', '미에', '안드로셀레스', 'EPOREDORIX', 'ARAMU', '류우', '레이널드', '니콜로사', '타르니스', '에드', '헨리', 'CHIMALPAHIN', '알프가르다', 'EPIMENES', '레위', '스비스라브', '동면왕', '속돌', '밤비', 'MYKALE', '이장', 'LAGIA'];
    const randomIndex = Math.floor(Math.random() * category.length);
    return category[randomIndex];
};

const randomAge = () => {
    const category = ["10대", "20대", "30대", "40대", "50대", "60대", "70대", "80대"];
    const randomIndex = Math.floor(Math.random() * category.length);
    return category[randomIndex];
};

const randomGender = () => {
    const category = ["남자", "여자"];
    const randomIndex = Math.floor(Math.random() * category.length);
    return category[randomIndex];
};


export const makeUserDumpData = async () => {
    const email_list = generateRrandomEmail(10);
    try {
        for (let i = 0; i < email_list.length; i++) {
            const email = email_list[i];
            const newUser = new User({
                userId: email,
                password: "123",
                nickName: randomNickName(),
                gender: randomGender(),
                age: randomAge(),
                hashtag: []
            });
            await newUser.save();
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};
*/