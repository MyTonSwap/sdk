export interface TransactionEvent {
    event_id: string;
    timestamp: number;
    actions: Action[];
    value_flow: ValueFlow[];
    is_scam: boolean;
    lt: number;
    in_progress: boolean;
}

export interface Action {
    type: string;
    status: string;
    TonTransfer: TonTransfer;
    ContractDeploy: ContractDeploy;
    JettonTransfer: JettonTransfer;
    JettonBurn: JettonBurn;
    JettonMint: JettonMint;
    NftItemTransfer: NftItemTransfer;
    Subscribe: Subscribe;
    UnSubscribe: UnSubscribe;
    AuctionBid: AuctionBid;
    NftPurchase: NftPurchase;
    DepositStake: DepositStake;
    WithdrawStake: WithdrawStake;
    WithdrawStakeRequest: WithdrawStakeRequest;
    ElectionsDepositStake: ElectionsDepositStake;
    ElectionsRecoverStake: ElectionsRecoverStake;
    JettonSwap: JettonSwap;
    SmartContractExec: SmartContractExec;
    DomainRenew: DomainRenew;
    InscriptionTransfer: InscriptionTransfer;
    InscriptionMint: InscriptionMint;
    simple_preview: SimplePreview;
    base_transactions: string[];
}

export interface TonTransfer {
    sender: Sender;
    recipient: Recipient;
    amount: number;
    comment: string;
    encrypted_comment: EncryptedComment;
    refund: Refund;
}

export interface Sender {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Recipient {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface EncryptedComment {
    encryption_type: string;
    cipher_text: string;
}

export interface Refund {
    type: string;
    origin: string;
}

export interface ContractDeploy {
    address: string;
    interfaces: string[];
}

export interface JettonTransfer {
    sender: Sender2;
    recipient: Recipient2;
    senders_wallet: string;
    recipients_wallet: string;
    amount: string;
    comment: string;
    encrypted_comment: EncryptedComment2;
    refund: Refund2;
    jetton: Jetton;
}

export interface Sender2 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Recipient2 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface EncryptedComment2 {
    encryption_type: string;
    cipher_text: string;
}

export interface Refund2 {
    type: string;
    origin: string;
}

export interface Jetton {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image: string;
    verification: string;
    custom_payload_api_uri: string;
}

export interface JettonBurn {
    sender: Sender3;
    senders_wallet: string;
    amount: string;
    jetton: Jetton2;
}

export interface Sender3 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Jetton2 {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image: string;
    verification: string;
    custom_payload_api_uri: string;
}

export interface JettonMint {
    recipient: Recipient3;
    recipients_wallet: string;
    amount: string;
    jetton: Jetton3;
}

export interface Recipient3 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Jetton3 {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image: string;
    verification: string;
    custom_payload_api_uri: string;
}

export interface NftItemTransfer {
    sender: Sender4;
    recipient: Recipient4;
    nft: string;
    comment: string;
    encrypted_comment: EncryptedComment3;
    payload: string;
    refund: Refund3;
}

export interface Sender4 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Recipient4 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface EncryptedComment3 {
    encryption_type: string;
    cipher_text: string;
}

export interface Refund3 {
    type: string;
    origin: string;
}

export interface Subscribe {
    subscriber: Subscriber;
    subscription: string;
    beneficiary: Beneficiary;
    amount: number;
    initial: boolean;
}

export interface Subscriber {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Beneficiary {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface UnSubscribe {
    subscriber: Subscriber2;
    subscription: string;
    beneficiary: Beneficiary2;
}

export interface Subscriber2 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Beneficiary2 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface AuctionBid {
    auction_type: string;
    amount: Amount;
    nft: Nft;
    bidder: Bidder;
    auction: Auction;
}

export interface Amount {
    value: string;
    token_name: string;
}

export interface Nft {
    address: string;
    index: number;
    owner: Owner;
    collection: Collection;
    verified: boolean;
    metadata: Metadata;
    sale: Sale;
    previews: Preview[];
    dns: string;
    approved_by: string[];
    include_cnft: boolean;
    trust: string;
}

export interface Owner {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Collection {
    address: string;
    name: string;
    description: string;
}

export interface Metadata {}

export interface Sale {
    address: string;
    market: Market;
    owner: Owner2;
    price: Price;
}

export interface Market {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Owner2 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Price {
    value: string;
    token_name: string;
}

export interface Preview {
    resolution: string;
    url: string;
}

export interface Bidder {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Auction {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface NftPurchase {
    auction_type: string;
    amount: Amount2;
    nft: Nft2;
    seller: Seller;
    buyer: Buyer;
}

export interface Amount2 {
    value: string;
    token_name: string;
}

export interface Nft2 {
    address: string;
    index: number;
    owner: Owner3;
    collection: Collection2;
    verified: boolean;
    metadata: Metadata2;
    sale: Sale2;
    previews: Preview2[];
    dns: string;
    approved_by: string[];
    include_cnft: boolean;
    trust: string;
}

export interface Owner3 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Collection2 {
    address: string;
    name: string;
    description: string;
}

export interface Metadata2 {}

export interface Sale2 {
    address: string;
    market: Market2;
    owner: Owner4;
    price: Price2;
}

export interface Market2 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Owner4 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Price2 {
    value: string;
    token_name: string;
}

export interface Preview2 {
    resolution: string;
    url: string;
}

export interface Seller {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Buyer {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface DepositStake {
    amount: number;
    staker: Staker;
    pool: Pool;
    implementation: string;
}

export interface Staker {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Pool {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface WithdrawStake {
    amount: number;
    staker: Staker2;
    pool: Pool2;
    implementation: string;
}

export interface Staker2 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Pool2 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface WithdrawStakeRequest {
    amount: number;
    staker: Staker3;
    pool: Pool3;
    implementation: string;
}

export interface Staker3 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Pool3 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface ElectionsDepositStake {
    amount: number;
    staker: Staker4;
}

export interface Staker4 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface ElectionsRecoverStake {
    amount: number;
    staker: Staker5;
}

export interface Staker5 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface JettonSwap {
    dex: string;
    amount_in: string;
    amount_out: string;
    ton_in: number;
    ton_out: number;
    user_wallet: UserWallet;
    router: Router;
    jetton_master_in: JettonMasterIn;
    jetton_master_out: JettonMasterOut;
}

export interface UserWallet {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Router {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface JettonMasterIn {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image: string;
    verification: string;
    custom_payload_api_uri: string;
}

export interface JettonMasterOut {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image: string;
    verification: string;
    custom_payload_api_uri: string;
}

export interface SmartContractExec {
    executor: Executor;
    contract: Contract;
    ton_attached: number;
    operation: string;
    payload: string;
    refund: Refund4;
}

export interface Executor {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Contract {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Refund4 {
    type: string;
    origin: string;
}

export interface DomainRenew {
    domain: string;
    contract_address: string;
    renewer: Renewer;
}

export interface Renewer {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface InscriptionTransfer {
    sender: Sender5;
    recipient: Recipient5;
    amount: string;
    comment: string;
    type: string;
    ticker: string;
    decimals: number;
}

export interface Sender5 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Recipient5 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface InscriptionMint {
    recipient: Recipient6;
    amount: string;
    type: string;
    ticker: string;
    decimals: number;
}

export interface Recipient6 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface SimplePreview {
    name: string;
    description: string;
    action_image: string;
    value: string;
    value_image: string;
    accounts: Account[];
}

export interface Account {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface ValueFlow {
    account: Account2;
    ton: number;
    fees: number;
    jettons: Jetton4[];
}

export interface Account2 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Jetton4 {
    account: Account3;
    jetton: Jetton5;
    quantity: number;
}

export interface Account3 {
    address: string;
    name: string;
    is_scam: boolean;
    icon: string;
    is_wallet: boolean;
}

export interface Jetton5 {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image: string;
    verification: string;
    custom_payload_api_uri: string;
}
