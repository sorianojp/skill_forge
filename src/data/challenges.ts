export type ChallengeLang = 'js' | 'ts' | 'node' | 'c' | 'cpp' | 'java' | 'csharp';

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
];
