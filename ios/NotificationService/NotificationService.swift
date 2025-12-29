//
//  NotificationService.swift
//  MobileTodoList Notification Service
//

import UserNotifications

@available(iOS 10.0, *)
class NotificationService: UNNotificationServiceExtension {
    
    var contentHandler: ((UNNotificationContent) -> Void)?
    var bestAttemptContent: UNMutableNotificationContent?
    
    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        self.contentHandler = contentHandler
        bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
        
        if let bestAttemptContent = bestAttemptContent {
            // Modify notification content here
            bestAttemptContent.title = "\(bestAttemptContent.title) 🛒"
            
            // Add custom data handling
            if let userInfo = bestAttemptContent.userInfo as? [String: Any] {
                if let dealTitle = userInfo["deal_title"] as? String {
                    bestAttemptContent.body = "💰 \(dealTitle) - \(bestAttemptContent.body)"
                }
            }
            
            contentHandler(bestAttemptContent)
        }
    }
    
    override func serviceExtensionTimeWillExpire() {
        // Called just before the extension will be terminated by the system
        if let contentHandler = contentHandler, let bestAttemptContent = bestAttemptContent {
            contentHandler(bestAttemptContent)
        }
    }
}
