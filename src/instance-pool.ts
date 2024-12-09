import { Dependency } from "@flamework/core";
import { BaseComponent, Component, type Components } from "@flamework/components";
import { BaseID } from "@rbxts/id";

interface BaseInstancePool<T extends PoolableInstance<Instance>> {
  take(): T;
}

export interface InstancePoolOptions<T extends PoolableInstance<Instance>> {
  readonly prefab: T["instance"],
  readonly parent?: Instance,
  readonly fillAmount?: number;

  whenNoInstances?(pool: InstancePool<T>): T;
}

@Component()
export abstract class PoolableInstance<T extends Instance> extends BaseComponent<{}, T> {
  private returnFunction?: () => void;

  public initialize(returnFunction: () => void): void {
    this.returnFunction = returnFunction;
  }

  public returnToPool(): void {
    this.returnFunction?.();
  }
}

export abstract class InstancePool<T extends PoolableInstance<Instance>> implements BaseInstancePool<T>, BaseID<string> {
  private readonly components = Dependency<Components>();
  private readonly pooledInstances: T[] = [];

  public constructor(
    public readonly id: string,
    private readonly options: InstancePoolOptions<T>
  ) {
    this.spawn(options.fillAmount ?? 0);
  }

  public take(): T {
    if (this.getPooledCount() === 0) {
      const whenNoInstances = this.options.whenNoInstances ?? (pool => pool.createPoolableInstance());
      whenNoInstances(this);
    }

    const poolable = this.pooledInstances.pop()!;
    poolable.initialize(() => this.return(poolable));

    return poolable;
  }

  public getPooledCount(): number {
    return this.pooledInstances.size();
  }

  public getAllPoolables(): T[] {
    return this.components.getAllComponents(this.id);
  }

  public getActivePoolables(): T[] {
    return this.getAllPoolables().filter(poolable => !this.pooledInstances.includes(poolable));
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
    const instance = this.options.prefab.Clone();
    instance.Parent = this.options.parent;
    instance.AddTag(tag);

    const poolable: T = this.components.getComponent(instance, this.id)!;
    poolable.returnToPool();
    return poolable;
  }
}