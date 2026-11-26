export type ChallengeLang =
  | 'js'
  | 'python'
  | 'sql'
  | 'ts'
  | 'node'
  | 'c'
  | 'cpp'
  | 'java'
  | 'csharp'
  | 'bash';

export interface PracticeChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: ChallengeLang;
  topic: string;
  prompt: string;
  hint: string;
  starterCode: string;
  expectedStdout: string;
  schemaSql?: string;
}

export const PRACTICE_CHALLENGES: PracticeChallenge[] = [
  {
    id: 'js-two-sum',
    title: 'Two Sum Indices',
    difficulty: 'Easy',
    language: 'js',
    topic: 'Hash Maps',
    prompt:
      'Complete twoSum(nums, target) to return the two 0-based indices whose values sum to target in O(n) time. Print the results as shown.',
    hint: 'Store each visited number -> index in a Map, and check if target - nums[i] is already in the Map.',
    starterCode: `function twoSum(nums, target) {
  // TODO: return [i, j] in O(n) time
  return [0, 0];
}

console.log(JSON.stringify(twoSum([2, 7, 11, 15], 9)));
console.log(JSON.stringify(twoSum([3, 2, 4], 6)));`,
    expectedStdout: `[0,1]\n[1,2]`,
  },
  {
    id: 'js-valid-brackets',
    title: 'Valid Balanced Brackets',
    difficulty: 'Easy',
    language: 'js',
    topic: 'Stacks',
    prompt:
      'Complete isValid(s) so it returns true when every opening bracket (, [, { is closed in the correct LIFO order.',
    hint: 'Push opening brackets onto a stack array; when you see a closing bracket, pop and verify it matches.',
    starterCode: `function isValid(s) {
  // TODO: validate balanced brackets using a stack
  return false;
}

console.log(isValid("({[]})"));
console.log(isValid("([)]"));
console.log(isValid("{[]}[]"));`,
    expectedStdout: `true\nfalse\ntrue`,
  },
  {
    id: 'js-binary-search',
    title: 'Binary Search Target',
    difficulty: 'Easy',
    language: 'js',
    topic: 'Binary Search',
    prompt:
      'Return the index of target inside the sorted array nums, or -1 if not found, in O(log n) time.',
    hint: 'Track lo = 0 and hi = nums.length - 1, compute mid = lo + Math.floor((hi - lo) / 2), and shrink lo or hi.',
    starterCode: `function search(nums, target) {
  // TODO: implement O(log n) binary search
  return -1;
}

console.log(search([2, 5, 9, 14, 21, 30], 14));
console.log(search([2, 5, 9, 14, 21, 30], 7));`,
    expectedStdout: `3\n-1`,
  },
  {
    id: 'js-climb-stairs',
    title: 'Climbing Stairs (DP)',
    difficulty: 'Medium',
    language: 'js',
    topic: 'Dynamic Programming',
    prompt:
      'You can climb 1 or 2 steps at a time. Complete climbStairs(n) to return the number of distinct ways to reach step n.',
    hint: 'Use two rolling variables prev2 = 1 and prev1 = 1 and iterate from 2 to n.',
    starterCode: `function climbStairs(n) {
  // TODO: compute distinct ways in O(n) time
  return 0;
}

console.log(climbStairs(3));
console.log(climbStairs(5));
console.log(climbStairs(10));`,
    expectedStdout: `3\n8\n89`,
  },
  {
    id: 'js-longest-unique',
    title: 'Longest Unique Substring',
    difficulty: 'Medium',
    language: 'js',
    topic: 'Sliding Window',
    prompt:
      'Return the length of the longest contiguous substring without repeating characters using a Sliding Window.',
    hint: 'Keep a Set of characters in the current window; shrink left while the incoming character is already in the Set.',
    starterCode: `function longestUnique(s) {
  // TODO: return max length of substring with unique chars
  return 0;
}

console.log(longestUnique("abcabcbb"));
console.log(longestUnique("bbbbb"));
console.log(longestUnique("devpath"));`,
    expectedStdout: `3\n1\n7`,
  },
  {
    id: 'ts-narrow-result',
    title: 'Discriminated Union Formatter',
    difficulty: 'Easy',
    language: 'ts',
    topic: 'TypeScript',
    prompt:
      'Complete format(res) to return "OK: <value>" when res.ok is true and "ERR: <error>" when res.ok is false.',
    hint: 'Branch on if (res.ok) so TypeScript narrows res automatically.',
    starterCode: `type Result = { ok: true; value: number } | { ok: false; error: string };

function format(res: Result): string {
  // TODO: narrow res and return formatted string
  return "";
}

console.log(format({ ok: true, value: 98 }));
console.log(format({ ok: false, error: "timeout" }));`,
    expectedStdout: `OK: 98\nERR: timeout`,
  },
  {
    id: 'c-pointer-swap',
    title: 'In-Place Pointer Swap',
    difficulty: 'Easy',
    language: 'c',
    topic: 'C Pointers',
    prompt:
      'Complete swap(int *a, int *b) in C11 so it swaps the caller values in place using dereferencing.',
    hint: 'Use int tmp = *a; *a = *b; *b = tmp;.',
    starterCode: `#include <stdio.h>

void swap(int *a, int *b) {
    // TODO: swap *a and *b
}

int main(void) {
    int x = 12, y = 45;
    swap(&x, &y);
    printf("%d %d\\n", x, y);
    return 0;
}`,
    expectedStdout: `45 12`,
  },
  {
    id: 'cpp-stl-filter',
    title: 'STL Passing Score Count',
    difficulty: 'Medium',
    language: 'cpp',
    topic: 'C++ STL',
    prompt:
      'Complete count_passing(const std::vector<int>& scores) to return how many scores are >= 80.',
    hint: 'Use std::count_if with a lambda [](int s) { return s >= 80; } or a range-based for loop.',
    starterCode: `#include <algorithm>
#include <iostream>
#include <vector>

int count_passing(const std::vector<int>& scores) {
    // TODO: count scores >= 80
    return 0;
}

int main() {
    std::cout << count_passing({72, 80, 95, 64, 88}) << "\\n";
    return 0;
}`,
    expectedStdout: `3`,
  },
  {
    id: 'java-stream-sum',
    title: 'Java Streams Even Sum',
    difficulty: 'Medium',
    language: 'java',
    topic: 'Java 21 Streams',
    prompt:
      'Use the Java Streams API to filter even numbers from nums and print their sum.',
    hint: 'Call nums.stream().filter(n -> n % 2 == 0).mapToInt(Integer::intValue).sum().',
    starterCode: `import java.util.List;

public class Main {
    public static void main(String[] args) {
        var nums = List.of(3, 4, 7, 10, 12, 5);
        int evenSum = 0; // TODO: compute sum of even numbers with Streams
        System.out.println(evenSum);
    }
}`,
    expectedStdout: `26`,
  },
  {
    id: 'csharp-linq-top',
    title: 'C# LINQ High Scorers',
    difficulty: 'Medium',
    language: 'csharp',
    topic: 'C# LINQ',
    prompt:
      'Filter learners with Score >= 85, sort alphabetically by Name, and print their names joined by ", ".',
    hint: 'Chain .Where(l => l.Score >= 85).OrderBy(l => l.Name).Select(l => l.Name).',
    starterCode: `using System.Linq;

record Learner(string Name, int Score);

var list = new List<Learner>
{
    new("Sam", 92),
    new("Ana", 88),
    new("Leo", 74),
    new("Maya", 95)
};

// TODO: filter Score >= 85, order by Name, and join with ", "
var names = new List<string>();
Console.WriteLine(string.Join(", ", names));`,
    expectedStdout: `Ana, Maya, Sam`,
  },
  {
    id: 'node-word-freq',
    title: 'Top Word Frequency',
    difficulty: 'Hard',
    language: 'node',
    topic: 'Node.js & Maps',
    prompt:
      'Complete topWord(words) to return the word that appears most frequently in the array.',
    hint: 'Count frequencies in a Map and track the word with the highest count.',
    starterCode: `function topWord(words) {
  // TODO: return most frequent word
  return "";
}

console.log(topWord(["git", "docker", "git", "linux", "git", "docker"]));`,
    expectedStdout: `git`,
  },
  {
    id: 'js-max-subarray',
    title: "Kadane's Max Subarray Sum",
    difficulty: 'Hard',
    language: 'js',
    topic: 'Dynamic Programming',
    prompt:
      'Find the largest possible sum of any contiguous subarray in O(n) time using Kadane\'s algorithm.',
    hint: 'Track cur = Math.max(n, cur + n) and best = Math.max(best, cur) for each element.',
    starterCode: `function maxSubArray(nums) {
  // TODO: implement O(n) Kadane's algorithm
  return 0;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
console.log(maxSubArray([5, 4, -1, 7, 8]));`,
    expectedStdout: `6\n23`,
  },
  {
    id: 'js-palindrome-two-ptr',
    title: 'Valid Palindrome (Two Pointers)',
    difficulty: 'Easy',
    language: 'js',
    topic: 'Two Pointers',
    prompt:
      'Complete isPalindrome(s) ignoring case and non-alphanumeric characters using O(1) extra space.',
    hint: 'Normalize to lowercase alphanumeric with s.toLowerCase().replace(/[^a-z0-9]/g, "") and compare left and right pointers.',
    starterCode: `function isPalindrome(s) {
  // TODO: return true if s is a palindrome ignoring punctuation/case
  return false;
}

console.log(isPalindrome("A man, a plan, a canal: Panama"));
console.log(isPalindrome("DevPath 2026"));`,
    expectedStdout: `true\nfalse`,
  },
  {
    id: 'js-merge-intervals',
    title: 'Merge Overlapping Intervals',
    difficulty: 'Medium',
    language: 'js',
    topic: 'Sorting & Greedy',
    prompt:
      'Sort intervals by start time and merge all overlapping ranges, printing the merged JSON array.',
    hint: 'Sort by a[0] - b[0]; if cur[0] <= last[1], set last[1] = Math.max(last[1], cur[1]), else push cur.',
    starterCode: `function mergeIntervals(intervals) {
  // TODO: merge overlapping [start, end] pairs
  return [];
}

console.log(JSON.stringify(mergeIntervals([[1, 3], [8, 10], [2, 6], [15, 18]])));`,
    expectedStdout: `[[1,6],[8,10],[15,18]]`,
  },
  {
    id: 'js-group-anagrams',
    title: 'Group Anagrams Count',
    difficulty: 'Medium',
    language: 'js',
    topic: 'Hash Maps',
    prompt:
      'Group words that are anagrams of each other and return the sorted sizes of each group.',
    hint: 'Sort each word\'s characters as the Map key (w.split("").sort().join("")) and count group lengths.',
    starterCode: `function anagramGroupSizes(words) {
  // TODO: return sorted array of anagram group sizes
  return [];
}

console.log(JSON.stringify(anagramGroupSizes(["eat", "tea", "tan", "ate", "nat", "bat"])));`,
    expectedStdout: `[1,2,3]`,
  },
  {
    id: 'js-coin-change',
    title: 'Minimum Coins (DP)',
    difficulty: 'Hard',
    language: 'js',
    topic: 'Dynamic Programming',
    prompt:
      'Return the fewest coins needed to make amount (or -1 if impossible) using bottom-up Dynamic Programming.',
    hint: 'Create dp array of size amount + 1 filled with Infinity, dp[0] = 0, and relax dp[a] = Math.min(dp[a], dp[a - c] + 1).',
    starterCode: `function coinChange(coins, amount) {
  // TODO: compute minimum coins to make amount
  return -1;
}

console.log(coinChange([1, 2, 5], 11));
console.log(coinChange([2], 3));`,
    expectedStdout: `3\n-1`,
  },
  {
    id: 'ts-generic-pick',
    title: 'Type-Safe Generic Pluck',
    difficulty: 'Easy',
    language: 'ts',
    topic: 'TypeScript Generics',
    prompt:
      'Complete pluck<T, K extends keyof T>(items, key) to return an array of the selected property values.',
    hint: 'Return items.map((item) => item[key]).',
    starterCode: `function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  // TODO: extract key from every item
  return [];
}

const tracks = [
  { slug: "ts", hours: 5 },
  { slug: "react", hours: 5 },
  { slug: "dsa", hours: 6 },
];
console.log(pluck(tracks, "slug").join(", "));`,
    expectedStdout: `ts, react, dsa`,
  },
  {
    id: 'ts-safe-filter',
    title: 'Type Predicate Compact Array',
    difficulty: 'Medium',
    language: 'ts',
    topic: 'Type Guards',
    prompt:
      'Complete isPresent<T>(v): v is T and use it to strip null and undefined values from raw.',
    hint: 'Return v !== null && v !== undefined inside isPresent, then return raw.filter(isPresent).',
    starterCode: `function isPresent<T>(v: T | null | undefined): v is T {
  // TODO: narrow out null and undefined
  return false;
}

const raw: (number | null | undefined)[] = [10, null, 20, undefined, 30];
const nums: number[] = raw.filter(isPresent);
console.log(nums.reduce((a, b) => a + b, 0));`,
    expectedStdout: `60`,
  },
  {
    id: 'c-array-max',
    title: 'Find Max via Const Pointer',
    difficulty: 'Easy',
    language: 'c',
    topic: 'C Arrays & Pointers',
    prompt:
      'Complete find_max(const int *arr, size_t n) in C11 to return the largest element in arr.',
    hint: 'Initialize int best = arr[0]; loop i from 1 to n - 1, updating best if arr[i] > best.',
    starterCode: `#include <stdio.h>

int find_max(const int *arr, size_t n) {
    // TODO: return max element in arr
    return 0;
}

int main(void) {
    int scores[] = {74, 98, 82, 91};
    printf("%d\\n", find_max(scores, 4));
    return 0;
}`,
    expectedStdout: `98`,
  },
  {
    id: 'cpp-unique-sorted',
    title: 'Deduplicate & Sort Vector',
    difficulty: 'Medium',
    language: 'cpp',
    topic: 'C++ STL',
    prompt:
      'Sort nums and remove duplicates using std::sort + std::unique + erase, then print space-separated values.',
    hint: 'Call std::sort(nums.begin(), nums.end()); then nums.erase(std::unique(nums.begin(), nums.end()), nums.end());.',
    starterCode: `#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> nums = {5, 2, 8, 2, 5, 1};
    // TODO: sort and remove duplicates from nums
    for (size_t i = 0; i < nums.size(); i++) {
        std::cout << nums[i] << (i + 1 < nums.size() ? " " : "");
    }
    std::cout << "\\n";
    return 0;
}`,
    expectedStdout: `1 2 5 8`,
  },
  {
    id: 'java-record-total',
    title: 'Java 21 Record Cart Total',
    difficulty: 'Easy',
    language: 'java',
    topic: 'Java Records & Streams',
    prompt:
      'Sum price * qty for every Item record in cart using Java Streams and print the integer total.',
    hint: 'Use cart.stream().mapToInt(i -> i.price() * i.qty()).sum().',
    starterCode: `import java.util.List;

public class Main {
    record Item(String name, int price, int qty) {}

    public static void main(String[] args) {
        var cart = List.of(new Item("Book", 25, 2), new Item("Pen", 5, 4));
        int total = 0; // TODO: compute total using Streams
        System.out.println(total);
    }
}`,
    expectedStdout: `70`,
  },
  {
    id: 'csharp-pattern-grade',
    title: 'C# Pattern Matching Switch',
    difficulty: 'Easy',
    language: 'csharp',
    topic: 'C# Pattern Matching',
    prompt:
      'Complete Grade(int s) using a C# switch expression: >= 90 -> "A", >= 80 -> "B", >= 70 -> "C", otherwise "Review".',
    hint: 'Use s switch { >= 90 => "A", >= 80 => "B", >= 70 => "C", _ => "Review" }.',
    starterCode: `static string Grade(int s) => s switch
{
    // TODO: add relational pattern arms
    _ => "Review"
};

Console.WriteLine($"{Grade(95)} {Grade(82)} {Grade(65)}");`,
    expectedStdout: `A B Review`,
  },
  {
    id: 'node-url-query',
    title: 'Parse Query Params (Node 20)',
    difficulty: 'Easy',
    language: 'node',
    topic: 'Node.js URL API',
    prompt:
      'Use new URL() to extract the "track" and "page" query parameters (defaulting page to 1) and print them.',
    hint: 'const u = new URL(raw); read u.searchParams.get("track") and Number(u.searchParams.get("page") ?? 1).',
    starterCode: `function parseParams(raw) {
  // TODO: parse track and page using new URL(raw)
  return { track: "", page: 0 };
}

console.log(JSON.stringify(parseParams("https://devpath.mycampus.ph/courses?track=node&page=2")));
console.log(JSON.stringify(parseParams("https://devpath.mycampus.ph/courses?track=dsa")));`,
    expectedStdout: `{"track":"node","page":2}\n{"track":"dsa","page":1}`,
  },
  {
    id: 'bash-error-count',
    title: 'Count HTTP 500 Errors in Bash',
    difficulty: 'Easy',
    language: 'bash',
    topic: 'Linux Pipes & grep',
    prompt:
      'Pipe $logs through grep and wc -l to print the exact number of lines containing "500".',
    hint: 'echo "$logs" | grep "500" | wc -l | tr -d " "',
    starterCode: `#!/usr/bin/env bash
logs=$'GET / 200\nPOST /api/run 500\nGET /courses 200\nPOST /api/sync 500\nGET /verify 404'

# TODO: print the count of lines containing 500
echo 0`,
    expectedStdout: `2`,
  },
  // --- Python 3 Challenges (In-Browser Pyodide) ---
  {
    id: 'py-dedupe-preserve-order',
    title: 'Deduplicate While Preserving Order',
    difficulty: 'Easy',
    language: 'python',
    topic: 'Lists & Dicts',
    prompt:
      'Complete dedupe(items) so it removes duplicate values while preserving first-seen order. Print the resulting list.',
    hint: 'In Python 3.7+, dict.fromkeys(items) preserves insertion order: return list(dict.fromkeys(items)).',
    starterCode: `def dedupe(items):
    # TODO: return unique items in original order
    return items

print(dedupe(["go", "sql", "go", "py", "sql", "js"]))`,
    expectedStdout: `['go', 'sql', 'py', 'js']`,
  },
  {
    id: 'py-word-frequency',
    title: 'Top 2 Word Frequencies',
    difficulty: 'Easy',
    language: 'python',
    topic: 'Collections & Counter',
    prompt:
      'Count case-insensitive word frequencies in text and print the top 2 words formatted as "word:count" separated by commas.',
    hint: 'Use collections.Counter(text.lower().split()).most_common(2).',
    starterCode: `from collections import Counter

def top_two(text):
    # TODO: return "word1:c1,word2:c2"
    return ""

print(top_two("Go rust go Python python go SQL"))`,
    expectedStdout: `go:3,python:2`,
  },
  {
    id: 'py-group-anagrams',
    title: 'Group Anagrams Count',
    difficulty: 'Medium',
    language: 'python',
    topic: 'Hash Maps',
    prompt:
      'Group words that are anagrams of each other and print the sorted sizes of each group.',
    hint: 'Use defaultdict(list) keyed by "".join(sorted(word)), then return sorted(len(g) for g in groups.values()).',
    starterCode: `from collections import defaultdict

def anagram_group_sizes(words):
    # TODO: group anagrams and return sorted group sizes
    return []

print(anagram_group_sizes(["eat", "tea", "tan", "ate", "nat", "bat"]))`,
    expectedStdout: `[1, 2, 3]`,
  },
  {
    id: 'py-matrix-transpose',
    title: 'Transpose a 2D Matrix',
    difficulty: 'Medium',
    language: 'python',
    topic: 'List Comprehensions',
    prompt:
      'Complete transpose(matrix) to flip rows and columns of a rectangular 2D list using zip(*matrix).',
    hint: 'return [list(row) for row in zip(*matrix)]',
    starterCode: `def transpose(matrix):
    # TODO: return transposed matrix as list of lists
    return matrix

print(transpose([[1, 2, 3], [4, 5, 6]]))`,
    expectedStdout: `[[1, 4], [2, 5], [3, 6]]`,
  },
  {
    id: 'py-merge-intervals',
    title: 'Merge Overlapping Intervals',
    difficulty: 'Medium',
    language: 'python',
    topic: 'Sorting & Intervals',
    prompt:
      'Given a list of [start, end] intervals, merge all overlapping intervals and print the sorted result.',
    hint: 'Sort intervals by start; if current start <= merged[-1][1], extend merged[-1][1] = max(merged[-1][1], end).',
    starterCode: `def merge_intervals(intervals):
    # TODO: merge overlapping intervals
    return intervals

print(merge_intervals([[1, 3], [8, 10], [2, 6], [15, 18]]))`,
    expectedStdout: `[[1, 6], [8, 10], [15, 18]]`,
  },
  {
    id: 'py-lru-simulation',
    title: 'LRU Cache Simulation',
    difficulty: 'Hard',
    language: 'python',
    topic: 'OrderedDict / Caching',
    prompt:
      'Implement a capacity-2 LRU cache using collections.OrderedDict so accessing a key refreshes recency and inserting a 3rd key evicts the least recently used key.',
    hint: 'On get: move_to_end(k). On put: set key, move_to_end(k), and if len > cap call popitem(last=False).',
    starterCode: `from collections import OrderedDict

class LRU:
    def __init__(self, cap):
        self.cap = cap
        self.data = OrderedDict()

    def get(self, k):
        # TODO: return value or -1 and refresh recency
        return -1

    def put(self, k, v):
        # TODO: insert/update and evict LRU when over capacity
        pass

c = LRU(2)
c.put("a", 1)
c.put("b", 2)
print(c.get("a"))
c.put("c", 3)
print(c.get("b"), c.get("c"))`,
    expectedStdout: `1\n-1 3`,
  },
  // --- SQL Challenges (In-Browser SQLite) ---
  {
    id: 'sql-top-earners',
    title: 'Filter & Sort Senior Salaries',
    difficulty: 'Easy',
    language: 'sql',
    topic: 'WHERE & ORDER BY',
    prompt:
      'Select name and salary from employees where salary >= 90000, ordered by salary descending. Output rows are graded as "col1 | col2".',
    hint: 'SELECT name, salary FROM employees WHERE salary >= 90000 ORDER BY salary DESC;',
    schemaSql: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, dept TEXT, salary INTEGER);
INSERT INTO employees VALUES
  (1, 'Ana', 'Backend', 110000),
  (2, 'Ben', 'Frontend', 85000),
  (3, 'Cara', 'Systems', 125000),
  (4, 'Dan', 'Backend', 92000);`,
    starterCode: `-- TODO: return name, salary for employees earning >= 90000 highest first
SELECT name, salary FROM employees LIMIT 1;`,
    expectedStdout: `Cara | 125000\nAna | 110000\nDan | 92000`,
  },
  {
    id: 'sql-dept-revenue',
    title: 'Department Total Spend (GROUP BY)',
    difficulty: 'Easy',
    language: 'sql',
    topic: 'GROUP BY & HAVING',
    prompt:
      'Return dept and SUM(amount) AS total for departments with total spend >= 500, ordered by total descending.',
    hint: 'SELECT dept, SUM(amount) AS total FROM expenses GROUP BY dept HAVING SUM(amount) >= 500 ORDER BY total DESC;',
    schemaSql: `CREATE TABLE expenses (id INTEGER PRIMARY KEY, dept TEXT, amount INTEGER);
INSERT INTO expenses VALUES
  (1, 'Cloud', 400),
  (2, 'Cloud', 350),
  (3, 'Design', 200),
  (4, 'Data', 520);`,
    starterCode: `-- TODO: group by dept with total >= 500 ordered descending
SELECT dept, amount FROM expenses LIMIT 1;`,
    expectedStdout: `Cloud | 750\nData | 520`,
  },
  {
    id: 'sql-unmatched-customers',
    title: 'Customers With Zero Orders (LEFT JOIN)',
    difficulty: 'Easy',
    language: 'sql',
    topic: 'LEFT JOIN',
    prompt:
      'Find all customer names who have never placed an order, ordered alphabetically by name.',
    hint: 'LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL ORDER BY c.name ASC.',
    schemaSql: `CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER);
INSERT INTO customers VALUES (1, 'Lia'), (2, 'Marco'), (3, 'Nadia'), (4, 'Owen');
INSERT INTO orders VALUES (10, 1), (11, 3);`,
    starterCode: `-- TODO: select names of customers with no orders, A-Z
SELECT name FROM customers LIMIT 1;`,
    expectedStdout: `Marco\nOwen`,
  },
  {
    id: 'sql-running-total',
    title: 'Cumulative Monthly Revenue',
    difficulty: 'Medium',
    language: 'sql',
    topic: 'Window Functions',
    prompt:
      'Select month, revenue, and the running cumulative sum of revenue ordered by month ascending.',
    hint: 'SELECT month, revenue, SUM(revenue) OVER (ORDER BY month) AS running FROM monthly ORDER BY month;',
    schemaSql: `CREATE TABLE monthly (month TEXT, revenue INTEGER);
INSERT INTO monthly VALUES ('2026-01', 100), ('2026-02', 250), ('2026-03', 150);`,
    starterCode: `-- TODO: select month, revenue, running_total
SELECT month, revenue, 0 FROM monthly;`,
    expectedStdout: `2026-01 | 100 | 100\n2026-02 | 250 | 350\n2026-03 | 150 | 500`,
  },
  {
    id: 'sql-top-per-track',
    title: 'Top Scorer Per Track (ROW_NUMBER)',
    difficulty: 'Medium',
    language: 'sql',
    topic: 'CTEs & Window Functions',
    prompt:
      'Return track, student, and score for the #1 highest-scoring student in each track, ordered by track A-Z.',
    hint: 'Use a CTE with ROW_NUMBER() OVER (PARTITION BY track ORDER BY score DESC) AS rn, then filter WHERE rn = 1.',
    schemaSql: `CREATE TABLE results (track TEXT, student TEXT, score INTEGER);
INSERT INTO results VALUES
  ('Go', 'Ana', 96), ('Go', 'Ben', 89),
  ('SQL', 'Cara', 92), ('SQL', 'Dan', 98);`,
    starterCode: `-- TODO: top 1 student per track ordered by track ASC
SELECT track, student, score FROM results LIMIT 1;`,
    expectedStdout: `Go | Ana | 96\nSQL | Dan | 98`,
  },
  {
    id: 'sql-repeat-buyers',
    title: 'Repeat Buyers With Avg Order >= 100',
    difficulty: 'Hard',
    language: 'sql',
    topic: 'CTEs & Aggregation',
    prompt:
      'Using a CTE or GROUP BY, return customer_id and COUNT(*) for customers who placed at least 2 paid orders AND have an average paid order total >= 100, ordered by customer_id ASC.',
    hint: "Filter WHERE status = 'paid', GROUP BY customer_id, HAVING COUNT(*) >= 2 AND AVG(total) >= 100.",
    schemaSql: `CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, status TEXT, total INTEGER);
INSERT INTO orders VALUES
  (1, 10, 'paid', 120), (2, 10, 'paid', 140),
  (3, 20, 'paid', 60),  (4, 20, 'paid', 80),
  (5, 30, 'paid', 200), (6, 30, 'refunded', 200),
  (7, 40, 'paid', 100), (8, 40, 'paid', 110);`,
    starterCode: `-- TODO: customer_id, paid_count for >=2 paid orders and avg >= 100
SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id LIMIT 1;`,
    expectedStdout: `10 | 2\n40 | 2`,
  },
];
