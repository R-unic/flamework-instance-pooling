# @rbxts/flamework-instance-pooling
Classes to pool Roblox instances, UIPool and PartPool included. Pooled instances can return themselves with no reference to the pool.

## Example
```ts
const pool = new PartPool(new Instance("Part"), World, 10);
const part = pool.take(new CFrame(0, 5, 0));
task.wait(6);
part.returnToPool();
```