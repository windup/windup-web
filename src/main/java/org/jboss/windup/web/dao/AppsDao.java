package org.jboss.windup.web.dao;

import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import org.jboss.windup.web.model.Application;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Manages Application entities.
 */
@Stateless
public class AppsDao {
    private static final Logger log = LoggerFactory.getLogger(AppsDao.class);

    @PersistenceContext
    private EntityManager em;


    public List<Application> getApplications_orderName(int limit) {
        return this.em.createQuery("SELECT a FROM Application a ORDER BY a.name").getResultList();
    }

    /**
     * Get Application by ID.
     */
    public Application getApplication(Long id) {
        return this.em.find(Application.class, id);
    }

    /**
     * Get Application by name.
     * @throws  NoResultException if no such product found.
     */
    public Application getApplicationByName( String name ) {
        return this.em.createQuery(
                "SELECT a FROM Application a "
                + "WHERE a.name = ?1", Application.class).setParameter(1, name).getSingleResult();
    }
    /**
     * Find Application by name.
     * @returns null if not found.
     */
    public Application findApplicationByName( String name ) {
        List<Application> list = this.em.createQuery("SELECT a FROM Application a WHERE a.name = ?1", Application.class).setParameter(1, name).getResultList();
        if( list.isEmpty() )  return null;
        return list.get(0);
    }


    /**
     * Add a new Application.
     */
    public Application addApplication( Application prod ) {
        return this.em.merge( prod );
    }

    /**
     * Remove a Application.
     */
    public void remove(Application prod) {
        Application managed = this.em.merge(prod);
        this.em.remove(managed);
        this.em.flush();
    }


    public Application update( Application product ) {
        Application managed = this.em.merge(product);
        return managed;
    }


    public void delete( Application prod ) {
        prod = this.em.merge(prod);
        this.em.remove(prod);
        this.em.flush();
    }

}
