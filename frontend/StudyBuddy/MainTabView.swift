//
//  MainTabView.swift
//  StudyBuddy
//
//  Created by Nano Kwok on 16/3/2568 BE.
//

import SwiftUI

struct MainTabView: View {
    var body: some View {
        TabView {
            ContentView()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("Home")
                }

        }
    }
}

#Preview {
    MainTabView()
}

