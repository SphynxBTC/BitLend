
;; title: LendingPool
;; version:
;; summary:
;; description:

;; traits
(use-trait ft-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

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
      (token-amount (ft-get-balance tx-sender))
    )
    (if (< token-amount amount)
      (err "Insufficient token balance to deposit.")
      (begin
        (transfer-ft token-contract amount tx-sender)
        (let ((balance (map-get? balance-map tx-sender)))
          (map-set balance-map tx-sender (+ balance amount))
        )
      )
    )
  )
)

(define-private (transfer-ft (token-contract <ft-trait>) (amount uint) (sender principal) (recipient principal))
  (contract-call? token-contract transfer amount sender recipient none)
)


(define-public (withdraw (token-contract <ft-trait>) (amount uint) )
  (let ((balance (map-get? balance-map tx-sender)))
    (if (> balance 0)
      (begin
        (transfer-ft token-contract tx-sender amount)
        (map-set balance-map tx-sender 0))
      (err "You have no deposited assets to withdraw.")
    )
  )
)

(define-public (borrow (token-contract <ft-trait>) (collateral-amount uint))
  (let (
      (collateral-balance (map-get? collateral-map tx-sender))
      (borrowed-balance (map-get? borrowed-map tx-sender))
      (max-borrowed-amount (* collateral-balance interest-rate))
    )
    (asserts! 
      (< collateral-amount max-borrowed-amount) 
      (err "Insufficient collateral to borrow the requested amount.")
    )
    (asserts! 
      (> collateral-amount borrowed-balance) 
      (err "You don't have enough collateral to borrow this amount.")
    )
    (map-set balance-map tx-sender (- collateral-balance collateral-amount))
    (map-set borrowed-map tx-sender (+ borrowed-balance borrowed-amount))
    (transfer-ft token-contract borrowed-amount tx-sender)
  )
)

(define-public (repay (token-contract <ft-trait>) (repayment-amount))
  (let (
      (borrowed-balance (map-get? borrowed-map tx-sender))
      (interest-owed (* (get borrowed-balance 0) interest-rate))
      (total-owed (+ (get borrowed-balance 0) interest-owed))
    )
    (asserts! 
      (< repayment-amount total-owed)
      (err "Insufficient repayment amount. You must repay the full amount owed.")
    )
    (begin
      (map-set tx-sender (+ borrowed-balance interest-owed))
      (map-set borrowed-map tx-sender 0)
      (transfer-ft tx-sender (- repayment-amount interest-owed))
    )
  )
)
;; read only functions
;;

;; private functions
;;

