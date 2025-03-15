import SwiftUI

struct ContentView: View {
    var body: some View {
        GeometryReader { geometry in
            VStack(alignment: .leading, spacing: 8) {
                
                // Header Section
                HStack(alignment: .center, spacing: 8) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Upcoming Sessions")
                            .font(.system(size: geometry.size.width * 0.06, weight: .bold))
                            .foregroundColor(.black)
                        Text("Plan your study times")
                            .font(.system(size: geometry.size.width * 0.04))
                            .foregroundColor(.black.opacity(0.5))
                    }
                    .frame(maxWidth: .infinity, minHeight: 52, maxHeight: 52, alignment: .topLeading)
                    
                    Image(systemName: "arrow.right")
                        .frame(width: 24, height: 24)
                        .foregroundColor(.gray)
                }
                .padding(.horizontal, geometry.size.width * 0.05)
                .padding(.top, 24)
                .padding(.bottom, 4)

                // Sub Header
                HStack(alignment: .bottom) {
                    Text("Upcoming Sessions")
                        .font(.system(size: geometry.size.width * 0.05, weight: .bold))
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity, alignment: .topLeading)
                    
                    Text("See All")
                        .font(.system(size: geometry.size.width * 0.04, weight: .bold))
                        .foregroundColor(Color(red: 0.23, green: 0.39, blue: 0.93))
                }
                .padding(.horizontal, geometry.size.width * 0.05)
                .padding(.top, 24)
                .padding(.bottom, 2)

                // Sessions List
                VStack(alignment: .leading, spacing: -15) {
                    ForEach(1...3, id: \.self) { i in
                        VStack {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Calculus \(i)")
                                    .font(.system(size: geometry.size.width * 0.045, weight: .bold))
                                    .foregroundColor(.black)
                                
                                VStack(alignment: .leading, spacing: 8) {
                                    HStack(alignment: .center, spacing: 8) {
                                        Image(systemName: "calendar")
                                            .frame(width: 12, height: 12)
                                            .foregroundColor(.gray)
                                        Text("Oct 12, 2023")
                                            .font(.system(size: geometry.size.width * 0.04))
                                            .foregroundColor(.black.opacity(0.5))
                                    }
                                    
                                    HStack(alignment: .center, spacing: 8) {
                                        Image(systemName: "clock")
                                            .frame(width: 12, height: 12)
                                            .foregroundColor(.gray)
                                        Text("3:00 PM")
                                            .font(.system(size: geometry.size.width * 0.04))
                                            .foregroundColor(.black.opacity(0.5))
                                    }
                                }
                            }
                        }
                        .padding(.horizontal, 12)
                        .padding(.top, 12)
                        .padding(.bottom, 16)
                        .frame(maxWidth: .infinity, alignment: .topLeading)
                        .background(Color.white)
                        .cornerRadius(12)
                        .shadow(color: Color.black.opacity(0.1), radius: 5, x: 2, y: 3)
                        .padding()
                    }
                }
                .padding(.horizontal, 12)
                .padding(.top, 12)
                .padding(.bottom, 16)

                // Friends Section
                HStack(alignment: .center, spacing: 8) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Friends")
                            .font(.system(size: geometry.size.width * 0.06, weight: .bold))
                            .foregroundColor(.black)
                        Text("Connect with classmates")
                            .font(.system(size: geometry.size.width * 0.04))
                            .foregroundColor(.black.opacity(0.5))
                    }
                    .frame(maxWidth: .infinity, minHeight: 52, maxHeight: 52, alignment: .topLeading)
                    
                    Image(systemName: "arrow.right")
                        .frame(width: 24, height: 24)
                        .foregroundColor(.gray)
                }
                .padding(.horizontal, geometry.size.width * 0.05)
                .padding(.top, 24)
                .padding(.bottom, 4)
            }
            .frame(width: geometry.size.width)
        }
    }
}

#Preview {
    ContentView()
}
