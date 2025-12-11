# Test OpenRouter Integration
# Run this script to verify OpenRouter is working correctly


from app.api.ai_api_client import query_advanced, query_ai, query_title


def test_basic_query():
    """Test basic AI query with DeepSeek V3"""
    print("🧪 Testing basic query (DeepSeek V3)...")
    messages = [{"role": "user", "content": "Say 'Hello from OpenRouter!' in a creative way."}]
    try:
        response = query_ai(messages)
        print(f"✅ Success: {response}\n")
        return True
    except Exception as e:
        print(f"❌ Error: {e}\n")
        return False


def test_title_generation():
    """Test title generation with Mistral Small"""
    print("🧪 Testing title generation (Mistral Small)...")
    messages = [
        {
            "role": "user",
            "content": "Generate a short title for a quiz about Python programming",
        }
    ]
    try:
        response = query_title(messages)
        print(f"✅ Success: {response}\n")
        return True
    except Exception as e:
        print(f"❌ Error: {e}\n")
        return False


def test_advanced_query():
    """Test advanced reasoning with Llama 3.3 70B"""
    print("🧪 Testing advanced query (Llama 3.3 70B)...")
    messages = [
        {
            "role": "user",
            "content": "Explain the concept of recursion in programming in one sentence.",
        }
    ]
    try:
        response = query_advanced(messages)
        print(f"✅ Success: {response}\n")
        return True
    except Exception as e:
        print(f"❌ Error: {e}\n")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("🚀 OpenRouter Integration Test Suite")
    print("=" * 60)
    print()

    results = []
    results.append(("Basic Query", test_basic_query()))
    results.append(("Title Generation", test_title_generation()))
    results.append(("Advanced Query", test_advanced_query()))

    print("=" * 60)
    print("📊 Test Results Summary")
    print("=" * 60)
    for name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{name}: {status}")

    total = len(results)
    passed = sum(1 for _, p in results if p)
    print(f"\nTotal: {passed}/{total} tests passed")
    print("=" * 60)
