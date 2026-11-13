import contextlib
import io
import json
import sys
import traceback

#Read the problem setup that piston.ts sends to stdin
payload = json.loads(sys.stdin.read())
function_name = payload["function_name"]
test_cases = payload["test_cases"]

#Load the user's code. If it doesn't import, report it to stderr and stop
try:
    import solution
    func = getattr(solution, function_name)
except AttributeError:
    print(f"Function '{function_name}' was not found in your code.", file=sys.stderr)
    sys.exit(1)
except Exception:
    print(traceback.format_exc(limit=0), file = sys.stderr)
    sys.exit(1)
#Run each test case and record the outcome
results = []
for case in test_cases:
    expected = case["expected"]
    captured = io.StringIO()
    try:
        with contextlib.redirect_stdout(captured):
            actual = func(*case["args"])
        actual = json.loads(json.dumps(actual, default=str))
        results.append({
            "passed": actual == expected,
            "actual": actual,
            "expected": expected,
            "stdout": captured.getvalue(),
        })
    except Exception as e:
        results.append({
            "passed": False,
            "expected": expected,
            "error": f"{type(e).__name__}: {e}",
            "stdout": captured.getvalue(),
        })
print(json.dumps(results))    