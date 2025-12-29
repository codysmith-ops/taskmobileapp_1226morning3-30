//
//  WidgetBridge.swift
//  MobileTodoList
//

import Foundation
import WidgetKit

@objc(WidgetBridge)
class WidgetBridge: NSObject {
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc
    func updateWidgetData(_ data: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let sharedDefaults = UserDefaults(suiteName: "group.com.codysmith.ellio") else {
            reject("ERROR", "Could not access App Group", nil)
            return
        }
        
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: data, options: [])
            let jsonString = String(data: jsonData, encoding: .utf8)
            sharedDefaults.set(jsonString, forKey: "shopping_list")
            sharedDefaults.synchronize()
            
            // Reload widget timelines
            if #available(iOS 14.0, *) {
                WidgetCenter.shared.reloadAllTimelines()
            }
            
            resolve(["success": true])
        } catch {
            reject("ERROR", "Failed to encode data: \(error.localizedDescription)", error)
        }
    }
    
    @objc
    func getWidgetData(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let sharedDefaults = UserDefaults(suiteName: "group.com.codysmith.ellio"),
              let jsonString = sharedDefaults.string(forKey: "shopping_list"),
              let jsonData = jsonString.data(using: .utf8) else {
            resolve(NSNull())
            return
        }
        
        do {
            let data = try JSONSerialization.jsonObject(with: jsonData, options: [])
            resolve(data)
        } catch {
            reject("ERROR", "Failed to decode data: \(error.localizedDescription)", error)
        }
    }
}
