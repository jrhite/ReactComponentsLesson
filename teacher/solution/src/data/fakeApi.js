// Pretend server. In a real app these would be fetch() calls to your API.

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fakeLogin(role) {
  await wait(300);
  return { id: 1, name: "Jane Doe", email: "jane@teamblog.dev", role };
}

export async function fetchPosts() {
  await wait(400);
  return [
    {
      id: 1,
      author: "Ana Ruiz",
      date: "Oct 2",
      title: "Moving our auth into a context provider",
      excerpt: "We were passing the user through six layers. Here's what changed when we stopped.",
      tags: ["react", "context"],
    },
    {
      id: 2,
      author: "Malik Osei",
      date: "Sep 29",
      title: "One Button component to rule them all",
      excerpt: "Fourteen button styles became one component with three variants.",
      tags: ["design-system"],
    },
    {
      id: 3,
      author: "Priya Nair",
      date: "Sep 25",
      title: "When not to split a component",
      excerpt: "A title inside a card doesn't need its own file. A few rules we use in review.",
      tags: ["react", "review"],
    },
  ];
}
