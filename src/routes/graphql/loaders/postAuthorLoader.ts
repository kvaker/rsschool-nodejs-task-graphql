import DataLoader from 'dataloader';

export function createPostAuthorLoader(prisma) {
  return new DataLoader(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
    });

    const userMap = new Map(users.map(user => [user.id, user]));

    return userIds.map((id) => userMap.get(id));
  });
}
