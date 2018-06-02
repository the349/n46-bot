class JobManager {
  /**
   * Manages jobs (like mutes) that should persist even if the bot restarts
   * @param {EnmapProvider} db the jobs database enmap provider
   */
  constructor (db, client) {
    this.db = db;
    this.client = client;
    this.actions = {};
    this.running = {};
  }

  async init () {
    await this.db.defer;
  }

  /**
   * Schedules all stored jobs for their given time
   */
  scheduleAll () {
    this.client.logger.info('Scheduling all stored jobs... (only do this once)', { module: 'JobManager' });

    // This is redundant but needed to pass the context
    // down to the scheduled action
    const scheduled = this.db.map((job, id) => {
      this.schedule(id, job);
    });

    this.client.logger.info(`Scheduled ${scheduled.length} jobs`, { module: 'JobManager' });
  }

  /**
   * Schedules a job using a timeout
   * @param  {string} id Unique ID for the job
   * @param  {object} job Job information
   * @return {timeout}
   */
  schedule (id, job) {
    // Add it to the database if not already
    this.client.logger.info(`Scheduling job "${id}" with action "${job.action}"`,
      { module: 'JobManager' });

    if (!this.db.has(id)) {
      this.db.set(id, job);
    }

    return setTimeout(() => {
      // Don't repeat a job
      // Don't run an actionless job
      if (this.db.has(id) && this.actions.hasOwnProperty(job.action)) {
        this.db.delete(id);
        this.actions[job.action](this.client, job.args);
      } else {
        this.client.logger
          .warn(`Job "${id}" with action "${job.action}" was never run, it might have been scheduled twice or canceled`,
            { module: 'JobManager' });
      }
    }, JobManager.calculateTime(job.time));
  }

  /**
   * Unschedules a job using a timeout
   * @param  {string} id ID for the job
   */
  unschedule (id) {
    this.db.delete(id);
  }

  /**
   * Calculates how long to wait for a certain time
   * @param  {number} time UTC Timestamp of the desired time
   * @return {number} milliseconds until then
   */
  static calculateTime (time) {
    return time - new Date().getTime();
  }

  /**
   * Creates an action that can be scheduled
   * @param  {string} name Name of the action
   * @param  {Function} fn Function to run, which should have a "client" argument and an "args" argument
   */
  action (name, fn) {
    this.actions[name] = fn;
  }
}

module.exports = JobManager;
