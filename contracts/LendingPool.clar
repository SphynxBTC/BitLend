
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

;; public functions
;;
;; (define-public (deposit (amount uint))
;;   ;; (begin
;;     (if (<= amount 0)
;;       (ok "Deposit successful")
;;       (err "Deposit amount must be greater than zero.")
;;     )
;;     (begin 
;;       (map-set balance-map (tx-sender) (+ (map-get? balance-map) amount))
;;     )
;;   ;; )
;; )


(define-public (deposit (amount uint) (token-contract <ft-trait>))
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
;; read only functions
;;

;; private functions
;;

