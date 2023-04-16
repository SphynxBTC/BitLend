
;; title: LendingPool
;; version:
;; summary:
;; description:

;; traits
(define-trait ft-trait
  (
    ;; Transfer from the caller to a new principal
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))

    ;; the human readable name of the token
    (get-name () (response (string-ascii 32) uint))

    ;; the ticker symbol, or empty if none
    (get-symbol () (response (string-ascii 32) uint))

    ;; the number of decimals used, e.g. 6 would mean 1_000_000 represents 1 token
    (get-decimals () (response uint uint))

    ;; the balance of the passed principal
    (get-balance (principal) (response uint uint))

    ;; the current total supply (which does not need to be a constant)
    (get-total-supply () (response uint uint))

    ;; an optional URI that represents metadata of this token
    (get-token-uri () (response (optional (string-utf8 256)) uint))
  )
)

;; token definitions
;; 

;; constants
;;

;; data vars
;;
(define-data-var interest-rate uint u0)

;; data maps
;;
(define-map balance-map principal uint)
(define-map borrowed-map principal uint)
(define-map collateral-map principal uint)


(define-public (deposit (token-contract <ft-trait>) (amount uint) )
  (let
    (
      (sender tx-sender)
      (token-amount (unwrap-panic (contract-call? token-contract get-balance tx-sender)))
      (balance (unwrap-panic (map-get? balance-map tx-sender)))
    )
    (asserts! (< token-amount amount) (err "Insufficient token balance to deposit."))
    (unwrap-panic (transfer-ft token-contract amount tx-sender (as-contract tx-sender)))
    (map-set balance-map tx-sender (+ balance amount))
    (ok true)
  )
)



(define-private (transfer-ft (token-contract <ft-trait>) (amount uint) (sender principal) (recipient principal))
  (contract-call? token-contract transfer amount sender recipient none)
)



(define-public (withdraw (xBTC-contract <ft-trait>) (amount uint) )
  (let 
    (
      (balance (unwrap-panic (map-get? balance-map tx-sender))))
    (if (> balance u0)
      (begin
        (unwrap-panic (transfer-ft xBTC-contract amount (as-contract tx-sender) tx-sender))
        (map-set balance-map tx-sender u0)
        (ok true)
      )
      (err "You have no deposited assets to withdraw.")
    )
  )
)



(define-public (borrow (USD-contract <ft-trait>) (borrowed-amount uint))
  (let (
      (usd-balance (* (unwrap-panic (map-get? balance-map tx-sender)) (var-get BTC-price)))
      (borrowed-balance (unwrap-panic (map-get? borrowed-map tx-sender)))
      (max-borrowed-amount (* (* borrowed-amount (var-get interest-rate)) (var-get BTC-price)))
    )
    (asserts! 
      (< usd-balance max-borrowed-amount) 
      (err "Insufficient balance to borrow the requested amount.")
    )
    (map-set balance-map tx-sender (- usd-balance borrowed-amount))
    (map-set borrowed-map tx-sender (+ borrowed-balance borrowed-amount))
    (unwrap-panic (transfer-ft USD-contract borrowed-amount (as-contract tx-sender) tx-sender))
    (ok true)
  )
)



(define-public (repay (USD-contract <ft-trait>) (repayment-amount uint))
  (let (
      (borrowed-balance (unwrap-panic (map-get? borrowed-map tx-sender)))
      (interest-owed (* borrowed-balance (var-get interest-rate)))
      (total-owed (+ borrowed-balance interest-owed))
    )
    (asserts! 
      (< repayment-amount total-owed)
      (err "Insufficient repayment amount. You must repay the full amount owed.")
    )
    (begin
      (map-set borrowed-map tx-sender (- borrowed-balance repayment-amount))
      (unwrap-panic (
        transfer-ft USD-contract (
          - repayment-amount interest-owed) (as-contract tx-sender) tx-sender
        )
      )
      (ok true)
    )
  )
)



;; (define-public (flash-loan (amount))
;;   (let (
;;       (balance (map-get balance-map (tx-sender)))
;;     )
;;     (if (< (get balance 0) amount)
;;       (err "Insufficient funds for flash loan.")
;;       (begin
;;         (set balance-map
;;           (update balance (- (get balance 0) amount) 0))
;;         (call (get-contract-address "flash-loan-contract") "execute-flash-loan" amount)
;;         (set balance-map
;;             (update balance (- (get balance 0) amount) 0))
;;         (call (get-contract-address "flash-loan-contract") "execute-flash-loan" amount)
;;         (set balance-map
;;             (update balance (+ (get balance 0) amount) 0))
;;         (ok "Flash loan successfully executed.")))
;;     (err "Insufficient funds for flash loan.")))

;; read only functions
;;

;; private functions
;;
