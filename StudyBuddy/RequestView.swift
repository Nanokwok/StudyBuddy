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
                                
                                VStack(alignment: .leading, spacing: 6) {
                                    Text("Poy Napapach")
                                        .font(.headline)
                                        .foregroundColor(.black)
                                    
                                    Text("Engineering")
                                        .font(.subheadline)
                                        .foregroundColor(.black.opacity(0.5))
                                }
                                
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
                                TagView(text: "Software Design")
                                TagView(text: "Mobile Dev")
                                TagView(text: "UI/UX")
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

// Reusable Tag Component
struct TagView: View {
    let text: String
    
    var body: some View {
        Text(text)
            .font(.footnote)
            .foregroundColor(Color(red: 0.23, green: 0.39, blue: 0.93))
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
            .background(Color(red: 0.23, green: 0.39, blue: 0.93).opacity(0.1))
            .cornerRadius(10)
    }
}

// Custom Flow Layout that wraps to next line when needed
struct FlowLayout: Layout {
    var spacing: CGFloat = 8
    
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout Void) -> CGSize {
        let maxWidth = proposal.width ?? .infinity
        var height: CGFloat = 0
        var width: CGFloat = 0
        var currentX: CGFloat = 0
        var currentY: CGFloat = 0
        var rowHeight: CGFloat = 0
        
        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)

            if currentX + size.width > maxWidth && currentX > 0 {
                currentX = 0
                currentY += rowHeight + spacing
                rowHeight = 0
            }

            rowHeight = max(rowHeight, size.height)
            currentX += size.width + spacing
            width = max(width, currentX - spacing)

            height = currentY + rowHeight
        }
        
        return CGSize(width: width, height: height)
    }
    
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout Void) {
        let maxWidth = bounds.width
        var currentX: CGFloat = bounds.minX
        var currentY: CGFloat = bounds.minY
        var rowHeight: CGFloat = 0
        
        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)

            if currentX + size.width > bounds.maxX && currentX > bounds.minX {
                currentX = bounds.minX
                currentY += rowHeight + spacing
                rowHeight = 0
            }
            
            subview.place(at: CGPoint(x: currentX, y: currentY), proposal: ProposedViewSize(size))
            rowHeight = max(rowHeight, size.height)
            currentX += size.width + spacing
        }
    }
}

#Preview {
    RequestView()
}
