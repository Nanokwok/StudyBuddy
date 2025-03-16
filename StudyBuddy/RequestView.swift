import SwiftUI

struct RequestView: View {
    var body: some View {
        GeometryReader { geometry in
            VStack(alignment: .leading, spacing: 12) {
                
                // Sticky Title
                Text("Friend requests")
                    .font(.title2).bold()
                    .foregroundColor(.black)
                    .padding(.horizontal, 16)
                    .padding(.top, 16)
                
                // Content Section
                VStack(alignment: .leading, spacing: 8) {
                    
                    // Loop over friend requests
                    ForEach(1...5, id: \.self) { _ in
                        VStack(alignment: .leading, spacing: 1) {
                            
                            // Request Item
                            HStack(alignment: .center, spacing: 16) {
                                Image(systemName: "person.circle.fill")
                                    .font(.system(size: 40))
                                    .foregroundColor(.gray)
                                
                                ProfileDetailView(
                                    name: "Amy Worawalan",
                                    description: "Engineering, Software and Knowledge Engineering"
                                )
                                
                                Spacer()
                                
                                HStack(spacing: 16) {
                                    Image(systemName: "hand.thumbsup")
                                        .resizable()
                                        .aspectRatio(contentMode: .fit)
                                        .frame(width: 28, height: 28)
                                        .foregroundColor(Color(red: 0.23, green: 0.39, blue: 0.93))
                                    
                                    Image(systemName: "hand.thumbsdown")
                                        .resizable()
                                        .aspectRatio(contentMode: .fit)
                                        .frame(width: 28, height: 28)
                                        .foregroundColor(Color(red: 0.23, green: 0.39, blue: 0.93))
                                }
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 12)
                            
                            // Tags Section
                            FlowLayout(spacing: 8) {
                                CourseTagView(text: "Software Design")
                                CourseTagView(text: "Mobile Dev")
                                CourseTagView(text: "UI/UX")
                            }
                            .padding(.horizontal, 16)
                            .padding(.bottom, 16)
                            
                        }
                        .background(.white)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(.black.opacity(0.12), lineWidth: 1)
                        )
                        .padding(.horizontal, 16)
                    }
                }
            }
            .frame(width: geometry.size.width, height: geometry.size.height, alignment: .topLeading)
        }
    }
}


#Preview {
    RequestView()
}
