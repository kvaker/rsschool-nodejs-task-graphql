import DataLoader from 'dataloader';

export function createUserFollowersLoader(prisma) {
  return new DataLoader(async (userIds) => {
    const usersWithFollowers = await prisma.user.findMany({
      where: { id: { in: userIds } },
      include: { userSubscribedTo: true },
    });

    const userMap = new Map();
    usersWithFollowers.forEach((user) => userMap.set(user.id, user.userSubscribedTo));

    return userIds.map((id) => userMap.get(id) || []);
  });
}
