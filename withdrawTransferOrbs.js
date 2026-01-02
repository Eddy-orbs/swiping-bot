
const dotenv = require('dotenv');
dotenv.config();

// ************************************************ configure here ****************************************
let steps = 3; // start steps  1: withdraw/restake, 2: burn, 3: transfer orbs
var task = 2; // 1: Restake, 2: Withdraw
var skipBurn = true;
// ************************************************ configure end ****************************************

const Web3 = require('web3');
const ethereumConnectionURL = process.env.RPC_URL; 
let stakingContractAddress = '0xeeae6791f684117b7028b48cb5dd21186df80b9c';
const STAKING_ABI = [{"inputs":[{"internalType":"uint256","name":"_cooldownPeriodInSec","type":"uint256"},{"internalType":"address","name":"_migrationManager","type":"address"},{"internalType":"address","name":"_emergencyManager","type":"address"},{"internalType":"contract IERC20","name":"_token","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakeOwner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalStakedAmount","type":"uint256"}],"name":"AcceptedMigration","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"emergencyManager","type":"address"}],"name":"EmergencyManagerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakeOwner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalStakedAmount","type":"uint256"}],"name":"MigratedStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IMigratableStakingContract","name":"stakingContract","type":"address"}],"name":"MigrationDestinationAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IMigratableStakingContract","name":"stakingContract","type":"address"}],"name":"MigrationDestinationRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"migrationManager","type":"address"}],"name":"MigrationManagerUpdated","type":"event"},{"anonymous":false,"inputs":[],"name":"ReleasedAllStakes","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakeOwner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalStakedAmount","type":"uint256"}],"name":"Restaked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IStakeChangeNotifier","name":"notifier","type":"address"}],"name":"StakeChangeNotifierUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakeOwner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalStakedAmount","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[],"name":"StoppedAcceptingNewStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakeOwner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalStakedAmount","type":"uint256"}],"name":"Unstaked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"stakeOwner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalStakedAmount","type":"uint256"}],"name":"Withdrew","type":"event"},{"constant":true,"inputs":[],"name":"MAX_APPROVED_STAKING_CONTRACTS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_stakeOwner","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"acceptMigration","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"acceptingNewStakes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IMigratableStakingContract","name":"_newStakingContract","type":"address"}],"name":"addMigrationDestination","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"approvedStakingContracts","outputs":[{"internalType":"contract IMigratableStakingContract","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cooldownPeriodInSec","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_totalAmount","type":"uint256"},{"internalType":"address[]","name":"_stakeOwners","type":"address[]"},{"internalType":"uint256[]","name":"_amounts","type":"uint256[]"}],"name":"distributeRewards","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"emergencyManager","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_stakeOwner","type":"address"}],"name":"getStakeBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalStakedTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_stakeOwner","type":"address"}],"name":"getUnstakeStatus","outputs":[{"internalType":"uint256","name":"cooldownAmount","type":"uint256"},{"internalType":"uint256","name":"cooldownEndTime","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"contract IMigratableStakingContract","name":"_stakingContract","type":"address"}],"name":"isApprovedStakingContract","outputs":[{"internalType":"bool","name":"exists","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IMigratableStakingContract","name":"_newStakingContract","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"migrateStakedTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"migrationManager","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"notifier","outputs":[{"internalType":"contract IStakeChangeNotifier","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"releaseAllStakes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"releasingAllStakes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IMigratableStakingContract","name":"_stakingContract","type":"address"}],"name":"removeMigrationDestination","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"restake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_newEmergencyManager","type":"address"}],"name":"setEmergencyManager","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_newMigrationManager","type":"address"}],"name":"setMigrationManager","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IStakeChangeNotifier","name":"_newNotifier","type":"address"}],"name":"setStakeChangeNotifier","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"stake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"stopAcceptingNewStakes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"unstake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address[]","name":"_stakeOwners","type":"address[]"}],"name":"withdrawReleasedStakes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

let orbsContractAddress = '0x614389EaAE0A6821DC49062D56BDA3d9d45Fa2ff';
const ORBS_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"userAddress","type":"address"},{"indexed":false,"internalType":"address payable","name":"relayerAddress","type":"address"},{"indexed":false,"internalType":"bytes","name":"functionSignature","type":"bytes"}],"name":"MetaTransactionExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"CHILD_CHAIN_ID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"CHILD_CHAIN_ID_BYTES","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEPOSITOR_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ERC712_VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ROOT_CHAIN_ID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ROOT_CHAIN_ID_BYTES","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"bytes","name":"depositData","type":"bytes"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"bytes","name":"functionSignature","type":"bytes"},{"internalType":"bytes32","name":"sigR","type":"bytes32"},{"internalType":"bytes32","name":"sigS","type":"bytes32"},{"internalType":"uint8","name":"sigV","type":"uint8"}],"name":"executeMetaTransaction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getDomainSeperator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNonce","outputs":[{"internalType":"uint256","name":"nonce","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"},{"internalType":"address","name":"childChainManager","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

let stopTimer = false;
let retryCount = 1;

var step1Sent = false;
var step2Sent = false;
var step3Sent = false;

console.log("task: " + (task == 1 ? "Restake" : "Withdraw"));

async function waitTopup() {
    let web3 = await new Web3(new Web3.providers.HttpProvider(ethereumConnectionURL));

    // contents of keystore file, can do a fs read
    // const keystore = "Contents of keystore file";
    // 0x1380a426eea8ad49c2384713fdb5c57aa7507cafc1d6148e3aaf883c7c0c1c23 // DK , 0xa419a9bef5aec5df8e9a651fb960094856257e44
    const decryptedAccount = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

    console.log("AccountInfo: " + decryptedAccount.address);
    console.log("transfer To: " + process.env.TRANSFER_TO_ADDRESS);

    // 500ms 마다 반복수행.
    var refreshIntervalId = setInterval(() => {
        if (stopTimer || (steps > 3)) {
            clearInterval(refreshIntervalId);
        } else {
            // 가스비용 잔액을 읽어서 호출
            runTargetTx(decryptedAccount, web3);
        }
        // runTargetTx(decryptedAccount);
      }, 400);
}

async function runTargetTx(decryptedAccount, web3) {

    /****************************
     * 
     * 첫 번째 컨트랙트 실행 - withdraw
     * 
     *****************************/
    if (steps == 1 && step1Sent == false) {
                    // 가스비가 들어오면 실행되도록 체크, 이 때 읽기 편한 ETH단위로 변환
        var balance = await web3.eth.getBalance(decryptedAccount.address);
        let balance2 =  web3.utils.fromWei(balance, 'ether'); // web3.utils.toBN(balance);
        console.log("[wait STEP1] MATIC1: " + balance2);
        if (parseFloat(balance2) < 0.02) {
            return;
        }

        step1Sent = true;

        console.log("====== TX1 START ======");

        let stakingContract = await new web3.eth.Contract(STAKING_ABI, stakingContractAddress);
        let nonce = await web3.eth.getTransactionCount(decryptedAccount.address);
        console.log("nonce1: " + nonce);

        // gasLimit 구하기 : 해당 컨트렉트 실행에 필요한 리미트를 미리 구하고 시간단축을 위해 상수로 넣음.
        let result1;

        if (task == 1) {
            result1 = await stakingContract.methods.restake().estimateGas({from: decryptedAccount.address});
        } else {
            result1 = await stakingContract.methods.withdraw().estimateGas({from: decryptedAccount.address});
        }
        console.log("gasLimit1: " + result1); // 82695
        let gasLimit = result1;
    
        // 혹시 모르니 여러번 수행하게...
        // retryCount--;
        // if (retryCount == 0) {
        //     stopTimer = true;
        // }
        // stopTimer = true;

        // 가스비 계산을 위해 gwei를 wei단위로 변환
        let balanceGwei = web3.utils.fromWei(balance, "gwei");
        
        // wei 단위의 잔액 확인
        // console.log("balance: " + balance);

        // gasfee = gasPrice * gasLimit
        // 최대로 현재 topup된 밸런스에 근접한 gasfee를 구하도록 gasPrice를 역으로 산출.
        var gasPrice = Math.floor(parseInt(balance) / parseInt(gasLimit));
        
        console.log("gasPrice1: " +  gasPrice.toString());

        var data;

        if (task == 1) {
            data = stakingContract.methods.restake().encodeABI();
        } else {
            data = stakingContract.methods.withdraw().encodeABI();
        }

        var rawTransaction = {
            "from": decryptedAccount.address,
            "to": stakingContractAddress,
            "value": '0x0',
            "gasPrice": web3.utils.toHex(gasPrice),
            "gas": gasLimit,
            "data": data,
            // "data": stakingContract.methods.restake().encodeABI(),
            "nonce": nonce,
            "chainId": 137
        };
    
        console.log("TX1 built and sent");

        // Sign and send out
        const signedTx = await web3.eth.accounts.signTransaction(rawTransaction, decryptedAccount.privateKey);
        // console.log(signedTx);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt);


        if (skipBurn) {
            steps = 3;
        } else {
            steps = 2;
        }
        
        console.log("====== TX1 FINISH ======");
    }


    
    /****************************
     * 
     * 2 번째 컨트랙트 실행 - burn gas fee
     * 
     *****************************/

    if (steps == 2 && step2Sent == false) {

        step2Sent = true;

        var balance = await web3.eth.getBalance(decryptedAccount.address);
        let balance2 =  web3.utils.fromWei(balance, 'ether'); // web3.utils.toBN(balance);
        console.log("[wait STEP1] MATIC1: " + balance2);
        if (parseFloat(balance2) < 0.002) {
            step2Sent = false;
            return;
        }

        console.log("====== TX2 START ======");

        let nonce = await web3.eth.getTransactionCount(decryptedAccount.address);
        console.log("nonce1: " + nonce);

        // gasLimit 구하기 : 해당 컨트렉트 실행에 필요한 리미트를 미리 구하고 시간단축을 위해 상수로 넣음.
        let gasLimit = 21000;
    
        // 혹시 모르니 여러번 수행하게...
        // retryCount--;
        // if (retryCount == 0) {
        //     stopTimer = true;
        // }
        // stopTimer = true;

        // 가스비 계산을 위해 gwei를 wei단위로 변환
        let balanceGwei = web3.utils.fromWei(balance, "gwei");
        
        // wei 단위의 잔액 확인
        // console.log("balance: " + balance);

        // gasfee = gasPrice * gasLimit
        // 최대로 현재 topup된 밸런스에 근접한 gasfee를 구하도록 gasPrice를 역으로 산출.
        var gasPrice = Math.floor(parseInt(balance) / parseInt(gasLimit));
        
        console.log("gasPrice1: " +  gasPrice.toString());

        if (gasPrice < 30000000000) {
            step2Sent = false;
            return;
        }

        var valueToSend = Math.floor(parseInt(balance)) - (gasPrice * gasLimit);

        console.log("valueToSend: " +  valueToSend);

        // return;

        const rawTransaction = {
        "from": decryptedAccount.address,
        "to": process.env.TRANSFER_TO_ADDRESS, //0x1B024611441Bf0352d2Bd03D5BFC68adc87e498C  0xEeAE6791F684117B7028b48Cb5dD21186dF80B9c
        "value": valueToSend, //web3.utils.toHex(web3.utils.toWei("0.1", "ether")),
        "gasPrice": gasPrice, 
        "gas": gasLimit,
        "nonce": nonce,
        "chainId": 137
        };
    
        console.log("TX2 built and sent");

        // Sign and send out
        const signedTx = await web3.eth.accounts.signTransaction(rawTransaction, decryptedAccount.privateKey);
        // console.log(signedTx);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt);

        console.log("====== TX2 FINISH ======");

        steps = 3
    }

    /****************************
     * 
     * 3 번째 컨트랙트 실행 - transfer ORBS
     * 
     *****************************/

    if (steps == 3 && step3Sent == false) {
        let orbsContract = await new web3.eth.Contract(ORBS_ABI, orbsContractAddress);

        var balance = await web3.eth.getBalance(decryptedAccount.address);
        var balance2 = web3.utils.fromWei(balance, 'ether'); // web3.utils.toBN(balance);
        console.log("[wait STEP2] MATIC2: " + balance2);
        if (parseFloat(balance2) < 0.02) {
            return;
        }

        step3Sent = true;

        console.log("====== TX3 START ======");

        var orbsBalanceWei =  await orbsContract.methods.balanceOf(decryptedAccount.address).call();
        console.log("orbsBalanceWei:" + orbsBalanceWei);

        var nonce2 = await web3.eth.getTransactionCount(decryptedAccount.address);
        console.log("nonce2: " + nonce2);


        let balanceOrbs2 = web3.utils.fromWei(orbsBalanceWei, 'ether'); // web3.utils.toBN(balance);
        if (parseFloat(balanceOrbs2) < 1) {
            return;
        }
    
        // gasLimit 구하기 : 해당 컨트렉트 실행에 필요한 리미트를 미리 구함
        let result2 = await orbsContract.methods.transfer(web3.utils.toChecksumAddress(process.env.TRANSFER_TO_ADDRESS), orbsBalanceWei).estimateGas({from: decryptedAccount.address});
        console.log("gasLimit2:" + result2); // gasLimit2:43027
        let gasLimit = result2;

        // 혹시 모르니 여러번 수행하게...??
        // retryCount--;
        // if (retryCount == 0) {
        //     stopTimer = true;
        // }
        stopTimer = true;

        // 가스비 계산을 위해 gwei를 wei단위로 변환
        let balanceGwei = web3.utils.fromWei(balance, "gwei");
        
        // wei 단위의 잔액 확인
        // console.log("balance(2): " + balance);

        // gasfee = gasPrice * gasLimit
        // 최대로 현재 topup된 밸런스에 근접한 gasfee를 구하도록 gasPrice를 역으로 산출.
        var gasPrice = Math.floor(parseInt(balance) / parseInt(gasLimit));
        
        console.log("gasPrice1: " +  gasPrice.toString());

        var rawTransaction = {
            "from": web3.utils.toChecksumAddress(decryptedAccount.address),
            "to": orbsContractAddress,
            "value": '0x0',
            "gasPrice": web3.utils.toHex(gasPrice),
            "gas": gasLimit,
            "data": orbsContract.methods.transfer(web3.utils.toChecksumAddress(process.env.TRANSFER_TO_ADDRESS), orbsBalanceWei).encodeABI(),
            "nonce": nonce2,
            "chainId": 137
        };
    
        // console.log(rawTransaction);

        console.log("TX3 built and sent");

        // Sign and send out
        const signedTx = await web3.eth.accounts.signTransaction(rawTransaction, decryptedAccount.privateKey);
        // console.log(signedTx);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt);

        steps = 4;

        console.log("!!!!!!FINISHED!!!!!!");
    }
}

waitTopup()
  .then(results => {
    // console.log('\x1b[33m%s\x1b[0m', "\n\nDone!!\n");
  }).catch(console.error);
