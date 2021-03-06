import { rest } from 'msw';
import _ from 'lodash';

/* eslint-disable no-param-reassign */

const tasks = (state) => ([
  rest.post('/api/v1/lists/:id/tasks', (req, res, ctx) => {
    const { text } = req.body;

    const task = {
      text,
      listId: req.params.id,
      id: _.uniqueId(),
      completed: false,
      touched: Date.now(),
    };
    state.tasks.push(task);

    return res(ctx.status(201), ctx.json(task));
  }),
  rest.patch('/api/v1/tasks/:id', (req, res, ctx) => {
    const taskId = req.params.id;
    const { completed } = req.body;

    const task = state.tasks.find((t) => t.id === taskId);

    return res(
      ctx.status(201),
      ctx.json({ ...task, completed, touched: Date.now() }),
    );
  }),
  rest.delete('/api/v1/tasks/:id', (req, res, ctx) => {
    const taskId = req.params.id;

    state.tasks = state.tasks.filter((t) => t.id !== taskId);

    return res(ctx.status(204));
  }),
]);

const lists = (state) => ([
  rest.post('/api/v1/lists', (req, res, ctx) => {
    const { name } = req.body;
    const list = {
      id: _.uniqueId(),
      name,
      removable: true,
    };
    state.lists.push(list);

    return res(ctx.status(201), ctx.json(list));
  }),
  rest.delete('/api/v1/lists/:id', (req, res, ctx) => {
    const listId = req.params.id;

    state.lists = state.lists.filter((l) => l.id !== listId);
    state.tasks = state.tasks.filter((t) => t.listId !== listId);

    return res(ctx.status(204));
  }),
]);

const handlers = (state) => [...tasks(state), ...lists(state)];

export default handlers;

/* eslint-enable no-param-reassign */
