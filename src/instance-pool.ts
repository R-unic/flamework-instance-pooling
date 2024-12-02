import { Dependency } from "@flamework/core";
import { BaseComponent, Component, type Components } from "@flamework/components";
import { BaseID } from "@rbxts/id";

interface BaseInstancePool<T extends PoolableInstance<Instance>> {
  take(): T;
}

@Component()
export abstract class PoolableInstance<T extends Instance> extends BaseComponent<{}, T> {
  public abstract initialize(returnFunction: (poolable: PoolableInstance<T>) => void): void;
  public abstract returnToPool(): void;
}

export abstract class InstancePool<T extends PoolableInstance<Instance>> implements BaseInstancePool<T>, BaseID<string> {
  private readonly components = Dependency<Components>();
  private readonly pooledInstances: T[] = [];

  public constructor(
    public readonly id: string,
    private readonly prefab: T["instance"],
    private readonly parent?: Instance,
    fillAmount = 0
  ) {
    this.spawn(fillAmount);
  }

  public take(): T {
    const createInstance = this.getPooledCount() === 0;
    let poolable = createInstance ?
      this.createPoolableInstance()
      : this.pooledInstances.pop()!;

    poolable.initialize(instance => this.return(<T>instance));
    return poolable;
  }

  public getPooledCount(): number {
    return this.pooledInstances.size();
  }

  protected spawn(amount: number): void {
    for (const _ of $range(1, amount))
      this.createPoolableInstance();
  }

  private return(poolable: T): void {
    this.pooledInstances.push(poolable);
  }

  private createPoolableInstance(): T {
    const [_, __, tag] = this.id.split("@");
    const instance = this.prefab.Clone();
    instance.Parent = this.parent;
    instance.AddTag(tag);

    const poolable: T = this.components.getComponent(instance, this.id)!;
    poolable.returnToPool();
    return poolable;
  }
}