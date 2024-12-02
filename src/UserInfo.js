const UserInfo = ({userId, nickname, balance}) => {
    return (
    <h3>닉네임: {nickname} <br/>
     잔액: {balance}</h3>)
}

export default UserInfo;