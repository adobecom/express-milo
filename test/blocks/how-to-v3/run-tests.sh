#!/bin/bash

# How-to-v3 Block Test Runner
# This script provides easy access to run different test configurations

echo "🚀 How-to-v3 Block Test Runner"
echo "================================"

# Check if we're in the right directory
if [ ! -f "how-to-v3.test.js" ]; then
    echo "❌ Error: Please run this script from the test/blocks/how-to-v3 directory"
    echo "   Current directory: $(pwd)"
    exit 1
fi

# Function to run tests
run_tests() {
    local test_pattern="$1"
    local description="$2"
    
    echo ""
    echo "🧪 Running: $description"
    echo "--------------------------------"
    
    cd ../../../
    npm test -- --grep "$test_pattern"
    cd test/blocks/how-to-v3
}

# Main menu
while true; do
    echo ""
    echo "Select test option:"
    echo "1) Run all how-to-v3 tests"
    echo "2) Run only JavaScript functionality tests"
    echo "3) Run only CSS integration tests"
    echo "4) Run tests in watch mode"
    echo "5) Exit"
    echo ""
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            run_tests "How-to-v3" "All how-to-v3 tests (JavaScript + CSS)"
            ;;
        2)
            run_tests "How-to-v3" "JavaScript functionality tests only"
            echo "Note: This will run both test files but you can filter output"
            ;;
        3)
            run_tests "How-to-v3 CSS Integration" "CSS integration tests only"
            ;;
        4)
            echo ""
            echo "🧪 Running tests in watch mode..."
            echo "--------------------------------"
            cd ../../../
            npm run test:watch -- --grep "How-to-v3"
            cd test/blocks/how-to-v3
            ;;
        5)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please enter a number between 1-5."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done
