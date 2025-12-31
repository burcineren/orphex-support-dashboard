export const generateMockData = () => {
  const statuses = ["New", "In Progress", "Waiting on Customer", "Done"];
  const priorities = ["Low", "Medium", "High"];
  const customers = [
    "Acme Corp",
    "TechStart Inc",
    "Global Solutions",
    "Digital Ventures",
    "CloudWorks",
  ];
  const tags = [
    "bug",
    "feature",
    "question",
    "urgent",
    "api",
    "billing",
    "integration",
  ];
  const titles = [
    "Login authentication failing",
    "API rate limit exceeded",
    "Dashboard loading slowly",
    "Export feature not working",
    "Mobile app crashes on startup",
    "Email notifications delayed",
    "Payment processing error",
    "Data sync issues",
  ];

  const now = new Date();
  const mockRequests = [];

  for (let i = 1; i <= 25; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const updatedDaysAgo = Math.floor(Math.random() * daysAgo);
    const updatedAt = new Date(
      now.getTime() - updatedDaysAgo * 24 * 60 * 60 * 1000
    );

    const hasComment = Math.random() > 0.3;
    const commentDaysAgo = hasComment
      ? Math.floor(Math.random() * daysAgo)
      : null;
    const lastCommentAt = hasComment
      ? new Date(
          now.getTime() - commentDaysAgo * 24 * 60 * 60 * 1000
        ).toISOString()
      : null;

    mockRequests.push({
      id: `REQ-${String(i).padStart(4, "0")}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      customer: customers[Math.floor(Math.random() * customers.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      lastCommentAt,
      tags: Array.from(
        { length: Math.floor(Math.random() * 3) + 1 },
        () => tags[Math.floor(Math.random() * tags.length)]
      ),
      comments: [],
    });
  }

  return mockRequests;
};

export const calculateNeedsAttention = (request) => {
  if (request.status === "Done") return { needsAttention: false, reasons: [] };

  const now = new Date();
  const created = new Date(request.createdAt);
  const updated = new Date(request.updatedAt);
  const lastComment = request.lastCommentAt
    ? new Date(request.lastCommentAt)
    : null;

  const lastActivity =
    lastComment && lastComment > updated ? lastComment : updated;
  const daysSinceCreation = (now - created) / (1000 * 60 * 60 * 24);
  const daysSinceActivity = (now - lastActivity) / (1000 * 60 * 60 * 24);

  const reasons = [];
  let needsAttention = false;

  if (request.priority === "High") {
    reasons.push("High priority");
    needsAttention = true;
  }

  if (daysSinceCreation > 7) {
    reasons.push("Aging request");
    needsAttention = true;
  }

  if (daysSinceActivity > 3) {
    reasons.push("No recent activity");
    needsAttention = true;
  }

  return { needsAttention, reasons };
};
