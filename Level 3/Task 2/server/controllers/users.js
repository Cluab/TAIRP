import User from '../models/User.js';

/* READ */

export const getUser = async (res, req) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ msg: 'User does not exist. ' });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserFriends = async (res, req) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(400).json({ msg: 'User does not exist. ' });

    const friends = await Promise.all(
      user.friends.map((id) => {
        User.findById(id);
      })
    );

    const formattedFriends = friends.map(
      (_id, firstName, lastName, occupation, location, picturePath) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE */

export const addRemoveFriend = async () => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user) return res.status(400).json({ msg: 'User does not exist. ' });
    if (!friend)
      return res.status(400).json({ msg: 'friend does not exist. ' });

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => {
        User.findById(id);
      })
    );

    const formattedFriends = friends.map(
      (_id, firstName, lastName, occupation, location, picturePath) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
