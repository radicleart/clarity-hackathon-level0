;; Project Administration
;; --------------------------

;; Constants
(define-constant administrator 'ST18PE05NG1YN7X6VX9SN40NZYP7B6NQY6C96ZFRC)
(define-constant not-allowed (err 1))

;; Storage
(define-data-var counter int 0)

;; PROJECT-MAP
;; params: 
;;     base-url - url from where to read project meta data
;;     mint-fee - fee 
(define-map project-map
  ((project-id principal))
  ((base-url (buff 40)) (mint-fee uint)))

;; Add a new project - administrator level call.
(define-public (add-project (projectId principal) (baseUrl (buff 40)) (mintFee uint))
  (begin
    (if (is-allowed)
      (begin
        (map-set project-map {project-id: projectId} ((base-url baseUrl) (mint-fee mintFee)))
        (ok projectId))
      (err not-allowed)
    )
  )
)

(define-read-only (get-project (projectId principal))
  (unwrap-panic (map-get? project-map {project-id: projectId})))

;; Only contract administrator can do these things.
(define-private (is-allowed)
  (is-eq tx-sender administrator)
)