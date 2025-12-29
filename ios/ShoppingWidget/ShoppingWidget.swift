//
//  ShoppingWidget.swift
//  ShoppingWidget
//

import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), itemCount: 0, items: [])
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = loadWidgetData()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let entry = loadWidgetData()
        let timeline = Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(3600)))
        completion(timeline)
    }
    
    private func loadWidgetData() -> SimpleEntry {
        guard let sharedDefaults = UserDefaults(suiteName: "group.com.codysmith.ellio"),
              let jsonString = sharedDefaults.string(forKey: "shopping_list"),
              let jsonData = jsonString.data(using: .utf8),
              let data = try? JSONDecoder().decode(WidgetData.self, from: jsonData) else {
            return SimpleEntry(date: Date(), itemCount: 0, items: [])
        }
        
        return SimpleEntry(date: Date(), itemCount: data.items.count, items: data.items)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let itemCount: Int
    let items: [ShoppingItem]
}

struct WidgetData: Codable {
    let items: [ShoppingItem]
}

struct ShoppingItem: Codable, Identifiable {
    let id: String
    let title: String
    let completed: Bool
}

struct ShoppingWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: "cart.fill")
                    .foregroundColor(.blue)
                Text("Shopping List")
                    .font(.headline)
                Spacer()
                Text("\(entry.itemCount)")
                    .font(.caption)
                    .padding(4)
                    .background(Color.blue.opacity(0.2))
                    .cornerRadius(8)
            }
            
            if entry.items.isEmpty {
                Text("No items")
                    .font(.caption)
                    .foregroundColor(.gray)
            } else {
                ForEach(entry.items.prefix(3)) { item in
                    HStack {
                        Image(systemName: item.completed ? "checkmark.circle.fill" : "circle")
                            .foregroundColor(item.completed ? .green : .gray)
                        Text(item.title)
                            .font(.caption)
                            .strikethrough(item.completed)
                        Spacer()
                    }
                }
                if entry.items.count > 3 {
                    Text("+ \(entry.items.count - 3) more")
                        .font(.caption2)
                        .foregroundColor(.gray)
                }
            }
        }
        .padding()
    }
}

@main
struct ShoppingWidget: Widget {
    let kind: String = "ShoppingWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            ShoppingWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Shopping List")
        .description("View your shopping list at a glance")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct ShoppingWidget_Previews: PreviewProvider {
    static var previews: some View {
        ShoppingWidgetEntryView(entry: SimpleEntry(date: Date(), itemCount: 3, items: [
            ShoppingItem(id: "1", title: "Milk", completed: false),
            ShoppingItem(id: "2", title: "Bread", completed: true),
            ShoppingItem(id: "3", title: "Eggs", completed: false)
        ]))
        .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
