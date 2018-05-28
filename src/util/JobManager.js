
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

  /**
   * Schedules all stored jobs for their given time
   */
  scheduleAll () {
    // This is redundant but needed to pass the context
    // down to the scheduled action
    return this.db.map((job, id) => {
      this.schedule(id, job);
    });
  }

  /**
   * Schedules a job using a timeout
   * @param  {string} id Unique ID for the job
   * @param  {object} job Job information
   * @return {timeout}
   */
  schedule (id, job) {
    // Add it to the database if not already
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
          .warn(`Job with ID "${id}" and action "${job.action}" was never run, it might have been scheduled twice`,
            { module: 'JobManager' });
      }
    }, JobManager.calculateTime(job.time));
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
