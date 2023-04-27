const { User } = require('../../db/models');
const userController = require('./user');

describe('User Controller', () => {
  const req = {
    body: {
      email: 'test@example.com',
      pwd: 'password',
      name: 'Test User',
    },
    query: {},
    params: { id: 1 },
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };

  describe('createUser', () => {
    it('should create a new user', async () => {
      const findOrCreate = jest.spyOn(User, 'findOrCreate').mockResolvedValue([{ email: req.body.email }, true]);

      await userController.createUser(req, res);

      expect(findOrCreate).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ email: req.body.email });
    });

    it('should return error if email already exists', async () => {
      jest.spyOn(User, 'findOrCreate').mockResolvedValue([{ email: req.body.email }, false]);

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Email already in use');
    });

    it('should return error on exception', async () => {
      jest.spyOn(User, 'findOrCreate').mockRejectedValue(new Error('Internal Server Error'));

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(new Error('Internal Server Error'));
    });
  });

  describe('getUsers', () => {
    it('should get all users', async () => {
      jest.spyOn(User, 'findAll').mockResolvedValue([{ id: 1, email: 'test@example.com' }]);

      await userController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith([{ id: 1, email: 'test@example.com' }]);
    });

    it('should return error for bad query params', async () => {
      const error = new Error();
      error.original = { routine: 'errorMissingColumn' };
      jest.spyOn(User, 'findAll').mockRejectedValue(error);

      await userController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Bad query params');
    });

    it('should return error on exception', async () => {
      jest.spyOn(User, 'findAll').mockRejectedValue(new Error('Internal Server Error'));

      await userController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(new Error('Internal Server Error'));
    });
  });

  describe('getUser', () => {
    it('should get a user by id', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue({ id: 1, email: 'test@example.com' });

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ id: 1, email: 'test@example.com' });
    });

    it('should return error if user is not found', async () => {
      jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Internal Server Error'));

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('User Not found');
    });

    it('should return error on exception', async () => {
      jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Internal Server Error'));

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(new Error('Internal Server Error'));
    });
  });

  describe('Update user', () => {
    it('should return error if the data is invalid', async () => {
        jest.spyOn(User, 'update').mockRejectedValue(new Error('Internal Server Error'));
    
        await userController.updateUser(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Invalid record');

    });

    it('should update user and return success', async () => {
        jest.spyOn(User, 'update').mockResolvedValue({ id: 1, email: 'test@example.com' });
        await userController.updateUser(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith('User updated successfully');
    })
  })

  describe('delete user', () => {
    it('should return error if the data is invalid', async () => {
        jest.spyOn(User, 'destroy').mockRejectedValue(new Error('Internal Server Error'));
    
        await userController.deleteUser(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Something went wrong');

    });

    it('should update user and return success', async () => {
        jest.spyOn(User, 'destroy').mockResolvedValue({ id: 1, email: 'test@example.com' });
        await userController.deleteUser(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith('User deleted successfully');
    })
  })
});